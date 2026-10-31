import { useAuth } from "@/entities/auth";

export function useLogout() {
  const { logout } = useAuth();

  return logout;
}
