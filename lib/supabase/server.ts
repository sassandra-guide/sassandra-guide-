import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client SERVEUR (pages, actions serveur). Utilise la clé PUBLIABLE + les règles RLS.
// Aucune clé service_role ici : si elle est un jour nécessaire, elle restera
// dans du code serveur uniquement, jamais dans une variable NEXT_PUBLIC_.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un composant serveur : le middleware s'en charge.
          }
        },
      },
    }
  );
}
