-- CreateTable
CREATE TABLE "DiscoveryLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscoveryLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiscoveryLog" ADD CONSTRAINT "DiscoveryLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
