import { Navigate } from "react-router";

import { LoginPage } from "@/pages/login";

import { useAuth } from "@/entities/auth";

import { Spinner } from "@/shared/ui";

export default function LoginRoute() {
  const { status } = useAuth();

  if (status === "initializing") {
    return (
      <main>
        <Spinner />
      </main>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
}
