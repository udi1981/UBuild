"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@ubuilder/ui";

/** Editor layout — full-screen, no sidebar, auth guard */
const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex h-dvh items-center justify-center bg-bg">
        <Spinner size={32} />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex h-dvh flex-col bg-bg">
      {children}
    </div>
  );
};

export default EditorLayout;
