import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter }) as any;

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up existing data to avoid conflicts on repeat runs
  // Note: Order matters for foreign keys
  await prisma.brandRule.deleteMany({})
  await prisma.assetAuditLog.deleteMany({})
  await prisma.asset.deleteMany({})
  await prisma.auditReport.deleteMany({})
  await prisma.visualIdentity.deleteMany({})
  await prisma.brandStrategy.deleteMany({})
  await prisma.workspace.deleteMany({})

  // 1. Workspace
  const workspace = await prisma.workspace.create({
    data: {
      id: 'default-workspace-id',
      name: 'Hening Coffee',
      industry: 'Beverage & Hospitality',
    },
  })

  // 2. Brand Strategy (Pilar 1: Genesis)
  await prisma.brandStrategy.create({
    data: {
      id: 'hening-strategy-id',
      workspaceId: workspace.id,
      brandName: 'Hening Coffee',
      whyStatement: 'To provide a space of tranquility in every sip.',
      archetypePrimary: 'The Magician',
      archetypeSecondary: 'The Innocent',
      coreValues: ['Peace', 'Quality', 'Sincerity'],
      toneOfVoice: 'Calm, Sophisticated, Warm',
    },
  })

  // 3. Visual Identity (Pilar 7: Visual Intelligence)
  await prisma.visualIdentity.create({
    data: {
      workspaceId: workspace.id,
      visualDnaKeywords: ['ZEN', 'MINIMALIST', 'EARTHY', 'LUXURY'],
      aakerProduct: 'Premium coffee beans and meditative cafe experience.',
      aakerOrganization: 'Committed to local farmers and sustainable roasting.',
      aakerPerson: 'A wise old friend who listens well.',
      aakerSymbol: 'The golden circle of a coffee cup shadow.',
      prismPhysique: 'Minimalist logo, gold and charcoal palette.',
      prismPersonality: 'Calm, wise, serene.',
      colorPalette: {
        name: 'The Golden Silence',
        colors: {
          primary: '#c5a059',
          secondary: '#1a1a1a',
          accent: '#f5f3f2',
          neutral1: '#ffffff',
          neutral2: '#262626'
        }
      },
      typography: {
        name: 'Sophisticated Serif',
        heading: { family: 'Playfair Display' },
        body: { family: 'Inter' }
      }
    },
  })

  // 4. Assets & Rules (Pilar 2: Fortress)
  const logo = await prisma.asset.create({
    data: {
      workspaceId: workspace.id,
      fileName: 'Logo_Hening_Main.png',
      s3Key: 'uploads/logo_main.png',
      mimeType: 'image/png',
      fileSize: 1024 * 45,
      tags: ['Logo', 'Main'],
      isLocked: true,
    },
  })

  await prisma.brandRule.createMany({
    data: [
      {
        workspaceId: workspace.id,
        assetId: logo.id,
        ruleType: 'clear_space',
        ruleValue: { percentage: 15 },
      },
      {
        workspaceId: workspace.id,
        assetId: logo.id,
        ruleType: 'allowed_formats',
        ruleValue: { formats: ['png', 'svg', 'webp'] },
      },
      {
        workspaceId: workspace.id,
        assetId: logo.id,
        ruleType: 'allowed_variants',
        ruleValue: { variants: ['primary', 'white'] },
      }
    ]
  })

  // 5. Audit Report (Pilar 2: Auditor)
  await prisma.auditReport.create({
    data: {
      workspaceId: workspace.id,
      targetUrl: 'https://heningcoffee.com',
      targetType: 'website',
      score: 72,
      status: 'completed',
      findings: [
        {
          severity: 'high',
          category: 'Logo Usage',
          description: 'Logo used without enough clear space in the header.',
          recommendation: 'Increase padding around logo to at least 15% of its width.'
        },
        {
          severity: 'medium',
          category: 'Color Compliance',
          description: 'Found #334455 which is not in the brand palette.',
          recommendation: 'Replace with Charcoal (#1a1a1a).'
        }
      ],
      colorAnalysis: {
        found: ['#c5a059', '#334455', '#ffffff'],
        reference: ['#c5a059', '#1a1a1a', '#ffffff'],
        violations: ['#334455']
      }
    }
  })

  console.log('✅ Seed successful!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
