import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {supabase} from "@lib/superbase";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export async function isLoggedIn(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  if (data.session) return true;

  return new Promise((resolve) => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      authListener.subscription.unsubscribe();
      resolve(!!session);
    });
  });
}

