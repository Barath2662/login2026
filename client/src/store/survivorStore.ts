import { useAuthStore } from './authStore';

export const useSurvivorStore = () => {
  const { isAuthenticated, survivor } = useAuthStore();
  
  // Extract registered world IDs from the survivor's registrations
  const registeredWorlds = survivor?.registrations?.map((reg: any) => reg.event_id || reg.eventId || reg.worldId) || [];
  
  return {
    isAuthenticated,
    registeredWorlds,
  };
};
