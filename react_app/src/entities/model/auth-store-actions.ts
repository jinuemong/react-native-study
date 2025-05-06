import NativeNotificationSpec from "@/shared/lib/spec/NativeNotificationSpec";
import { useAuthStore } from "./auth-store";

export const useAuthActions = () => {
  const { clearAuthData } = useAuthStore();

  const approveAuthRequest = () => {
    NativeNotificationSpec.setState(true, true);
    clearAuthData();
  };

  const denyAuthRequest = () => {
    NativeNotificationSpec.setState(true, false);
    clearAuthData();
  };

  return {
    approveAuthRequest,
    denyAuthRequest,
  };
};
