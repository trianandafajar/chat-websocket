"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export interface MyProfile {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  bio: string | null;
}

interface MyProfileContextValue {
  profile: MyProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const MyProfileContext = createContext<MyProfileContextValue | null>(null);

export function MyProfileProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (status !== "authenticated") return;

    setLoading(true);
    try {
      const res = await fetch("/api/profile", { credentials: "include" });
      if (res.ok) {
        const data: MyProfile = await res.json();
        setProfile(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      refresh();
    } else if (status === "unauthenticated") {
      setProfile(null);
    }
  }, [status, session?.user?.id, refresh]);

  return (
    <MyProfileContext.Provider value={{ profile, loading, refresh }}>
      {children}
    </MyProfileContext.Provider>
  );
}

export function useMyProfile() {
  const ctx = useContext(MyProfileContext);
  if (!ctx) {
    throw new Error("useMyProfile must be used within MyProfileProvider");
  }
  return ctx;
}
