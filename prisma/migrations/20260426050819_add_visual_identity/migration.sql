-- CreateTable
CREATE TABLE "VisualIdentity" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "aakerProduct" TEXT,
    "aakerOrganization" TEXT,
    "aakerPerson" TEXT,
    "aakerSymbol" TEXT,
    "visualDnaKeywords" TEXT[],
    "prismPhysique" TEXT,
    "prismPersonality" TEXT,
    "prismCulture" TEXT,
    "prismRelationship" TEXT,
    "prismReflection" TEXT,
    "prismSelfImage" TEXT,
    "colorPalette" JSONB,
    "typography" JSONB,
    "moodboardUrls" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisualIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisualIdentity_workspaceId_key" ON "VisualIdentity"("workspaceId");

-- AddForeignKey
ALTER TABLE "VisualIdentity" ADD CONSTRAINT "VisualIdentity_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
