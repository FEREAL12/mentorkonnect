"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string;
  isVerified: boolean;
}

export function VerifyMentorButton({ userId, isVerified }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const toggle = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/admin/verify-mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, verified: !isVerified }),
      });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={isVerified ? "outline" : "default"}
      onClick={toggle}
      disabled={isLoading}
      className="h-7 text-xs"
    >
      {isLoading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
      {isVerified ? "Unverify" : "Verify"}
    </Button>
  );
}
