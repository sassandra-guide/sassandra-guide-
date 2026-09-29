import { createClient } from "@/lib/supabase/server";
import type { Lieu } from "@/lib/data";

// Lectures publiques côté SERVEUR (soumises aux règles RLS : lecture seule).
// Retourne null en cas d'erreur, pour que les pages affichent un message clair.
export async function getLieux(): Promise<Lieu[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lieux")
    .select("*")
    .order("nom", { ascending: true });
  if (error) return null;
  return (data ?? []) as Lieu[];
}

export async function getLieu(id: string): Promise<Lieu | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("lieux").select("*").eq("id", id).maybeSingle();
  if (error) return null;
  return (data as Lieu | null) ?? null;
}
