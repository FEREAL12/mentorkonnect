import { Suspense } from "react";
import Link from "next/link";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <Link href="/" className="mb-10 flex items-center gap-0.5">
        <span className="text-2xl font-extrabold text-blue-700">Mentor</span>
        <span className="text-2xl font-extrabold text-orange-500">Konnect</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <Suspense>
          <VerifyOtpForm />
        </Suspense>
      </div>
    </div>
  );
}
