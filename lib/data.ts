export type Lieu = {
  id: string;
  nom: string;
  categorie: string;
  sous_categorie: string | null;
  description: string | null;
  telephone: string | null;
  whatsapp: string | null;
  adresse: string | null;
  quartier: string | null;
  point_repere: string | null;
  latitude: number | null;
  longitude: number | null;
  coordonnees_entree_lat: number | null;
  coordonnees_entree_lng: number | null;
  horaires: string | null;
  services: string[] | null;
  photos: string[] | null;
  etat_route: string | null;
  date_derniere_verification: string | null;
  statut_verification: string | null;
  is_demo: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

type Tri = [string, string, string];

export const CATS: Record<string, [string, string]> = {
  hotel: ["Hôtels", "🏨"], restaurant: ["Restaurants", "🍽️"], residence: ["Résidences", "🏢"],
  plage: ["Plages", "🏖️"], site: ["Sites touristiques", "🗼"], loisir: ["Loisirs", "🎉"],
  station: ["Stations-service", "⛽"], pharmacie: ["Pharmacies", "💊"], garage: ["Garages", "🔧"],
  commerce: ["Commerces", "🛒"], sante: ["Santé", "🏥"], banque: ["Banques", "🏦"],
  services_publics: ["Services publics", "🏛️"], transport: ["Transport", "🚌"],
  immobilier: ["Immobilier", "🏘️"], autres: ["Autres", "📌"],
};
export const VERIF: Record<string, Tri> = {
  verifie: ["✅", "Vérifié", "ok"],
  a_verifier: ["🕐", "À vérifier", "warn"],
  information_a_confirmer: ["❓", "Information à confirmer", "bad"],
};
export const ROUTE: Record<string, Tri> = {
  praticable: ["🟢", "Route praticable", "ok"],
  difficile: ["🟠", "Route difficile", "warn"],
  impraticable: ["🔴", "Route impraticable", "bad"],
  non_verifie: ["⚪", "État de la route non vérifié", "grey"],
};
export const REPORTS: [string, string][] = [
  ["lieu_ferme", "Lieu fermé"], ["mauvais_numero", "Mauvais numéro"],
  ["mauvaise_localisation", "Mauvaise localisation"], ["mauvais_horaire", "Mauvais horaire"],
  ["route_degradee", "Route dégradée"], ["route_impraticable", "Route impraticable"],
  ["autre", "Autre problème"],
];

export const norm = (s: string) =>
  String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const isNum = (n: unknown): n is number => typeof n === "number" && isFinite(n);

// Vrai seulement si les deux variables Supabase ont été renseignées (pas les placeholders).
export function isConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return !!url && !!key && !url.includes("VOTRE") && !key.includes("VOTRE");
}

// Destination de l'itinéraire : entrée précise si connue, sinon coordonnées principales.
export function destination(l: Lieu): [number, number] | null {
  if (isNum(l.coordonnees_entree_lat) && isNum(l.coordonnees_entree_lng))
    return [l.coordonnees_entree_lat, l.coordonnees_entree_lng];
  if (isNum(l.latitude) && isNum(l.longitude)) return [l.latitude, l.longitude];
  return null;
}
