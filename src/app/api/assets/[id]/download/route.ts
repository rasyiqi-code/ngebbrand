import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> })
{
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "png";
    const variant = searchParams.get("variant") || "primary";

    // 1. Fetch asset and rules from DB
    const asset = await prisma.asset.findUnique({
      where: { id }
    });

    if (!asset) {
      return new NextResponse("Asset not found", { status: 404 });
    }

    const rules = await prisma.brandRule.findMany({
      where: { assetId: id }
    });

    // 2. Fetch image buffer (Real or generated fallback)
    let imageBuffer: Buffer;
    const filePath = path.join(process.cwd(), "public", "uploads", asset.s3Key);
    
    try {
      imageBuffer = await fs.readFile(filePath);
    } catch (e) {
      // Fallback: Create a centered "logo" circle if file not found
      imageBuffer = await sharp({
        create: {
          width: 400,
          height: 400,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        }
      })
      .composite([{
        input: Buffer.from(`<svg><circle cx="200" cy="200" r="100" fill="${variant === 'primary' ? '#c5a059' : variant === 'white' ? '#FFFFFF' : '#1a1a1a'}" /></svg>`),
        top: 0,
        left: 0
      }])
      .png()
      .toBuffer();
    }

    // 3. Apply Brand Rules
    if (asset.isLocked) {
      const clearSpaceRule = rules.find((r: any) => r.ruleType === "clear_space");
      if (clearSpaceRule) {
        const percentage = (clearSpaceRule.ruleValue as any).percentage || 0;
        const padding = Math.round(400 * (percentage / 100));

        imageBuffer = await sharp(imageBuffer)
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .toBuffer();
      }
    }

    // 4. Convert to requested format
    let finalBuffer: Buffer;
    let contentType: string;

    switch (format.toLowerCase()) {
      case "jpg":
      case "jpeg":
        finalBuffer = await sharp(imageBuffer).flatten({ background: { r: 255, g: 255, b: 255 } }).jpeg().toBuffer();
        contentType = "image/jpeg";
        break;
      case "webp":
        finalBuffer = await sharp(imageBuffer).webp().toBuffer();
        contentType = "image/webp";
        break;
      default:
        finalBuffer = await sharp(imageBuffer).png().toBuffer();
        contentType = "image/png";
    }

    const filename = `brandos-${asset.fileName.split('.')[0]}-${variant}.${format}`;

    return new NextResponse(new Uint8Array(finalBuffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Asset download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
