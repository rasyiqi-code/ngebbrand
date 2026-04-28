import { getBrandContextAction, getExpertsAction } from "@/modules/pilar6-cortex/actions";
import { CortexDashboardWrapper } from "@/modules/pilar6-cortex/components/CortexDashboardWrapper";

export default async function CortexDashboard() {
  // Use default workspace ID from seed
  const workspaceId = "default-workspace-id";
  
  const [contextResult, expertsResult] = await Promise.all([
    getBrandContextAction(workspaceId),
    getExpertsAction()
  ]);

  const brandContext = contextResult.success ? contextResult.data : null;
  const experts = expertsResult.success ? expertsResult.experts : [];

  return (
    <CortexDashboardWrapper 
      brandContext={brandContext} 
      experts={experts} 
    />
  );
}
