import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type Profile = { id: string; role: string; full_name: string | null };

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<Profile | null>;
  signUp: (email: string, password: string, fullName?: string) => Promise<Profile | null>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function loadProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("id, role, full_name").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      setProfile(null);
      return;
    }
    const p = await loadProfile(userId);
    setProfile(p);
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        try {
          setProfile(await loadProfile(data.session.user.id));
        } catch {
          setProfile(null);
        }
      }
      if (mounted) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      // Keep loading true until profile resolves to avoid Access denied flash
      void (async () => {
        setLoading(true);
        setSession(next);
        if (next?.user) {
          try {
            const p = await loadProfile(next.user.id);
            if (mounted) setProfile(p);
          } catch {
            if (mounted) setProfile(null);
          }
        } else if (mounted) {
          setProfile(null);
        }
        if (mounted) setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      isAdmin: profile?.role === "admin" || profile?.role === "editor",
      signIn: async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setLoading(false);
          throw error;
        }
        const p = data.user ? await loadProfile(data.user.id) : null;
        setSession(data.session);
        setProfile(p);
        setLoading(false);
        return p;
      },
      signUp: async (email, password, fullName) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName || "" } },
        });
        if (error) {
          setLoading(false);
          throw error;
        }

        // Prefer immediate session (confirm-email off). If missing, sign in right away.
        let session = data.session;
        let user = data.user;
        if (!session) {
          const login = await supabase.auth.signInWithPassword({ email, password });
          if (login.error) {
            setLoading(false);
            throw new Error(
              "Account created. Turn off Confirm email in Supabase Auth settings, then log in.",
            );
          }
          session = login.data.session;
          user = login.data.user;
        }

        const p = user ? await loadProfile(user.id) : null;
        setSession(session);
        setProfile(p);
        setLoading(false);
        return p;
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setProfile(null);
      },
      refreshProfile,
    }),
    [session, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
