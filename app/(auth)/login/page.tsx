import { Suspense } from "react";
import { LoginRoleSelector } from "@/components/auth/LoginRoleSelector";

export default function LoginRolePage() {
  return (
    <Suspense>
      <LoginRoleSelector />
    </Suspense>
  );
}
