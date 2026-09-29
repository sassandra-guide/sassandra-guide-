"use client";
import Link from "next/link";
import { useState } from "react";
import { CATS, VERIF, type Lieu } from "@/lib/data";

export function Badge({ l }: { l: Lieu }) {
  if (l.is_demo) return <span className="b demo">🧪 DÉMO — non vérifié</span>;
  const v = VERIF[l.statut_verification ?? ""] || VERIF.a_verifier;
  return <span className={`b ${v[2]}`}>{v[0]} {v[1]}</span>;
}

export function Card({ l }: { l: Lieu }) {
  const c = CATS[l.categorie] || CATS.autres;
  return (
    <Link className="card" href={`/lieu/${l.id}`}>
      <div className="ico">{c[1]}</div>
      <div>
        <h3>{l.nom}</h3>
        <p>{c[0]}{l.quartier ? " · " + l.quartier : ""}</p>
        <Badge l={l} />
      </div>
    </Link>
  );
}

// Affiche la valeur, ou « À vérifier » si elle est inconnue (jamais d'information inventée).
export function Val({ v }: { v?: string | null }) {
  return v && v.trim() ? <>{v}</> : <span className="unk">À vérifier</span>;
}

export function Photos({ photos, emoji, alt }: { photos: string[]; emoji: string; alt: string }) {
  const [bad, setBad] = useState<string[]>([]);
  const ok = photos.filter((u) => u && !bad.includes(u));
  return (
    <div className="photos" style={{ marginTop: 12 }}>
      {ok.length ? (
        ok.map((u) => (
          <img key={u} src={u} alt={alt} loading="lazy" onError={() => setBad((b) => [...b, u])} />
        ))
      ) : (
        <div className="ph">{emoji}</div>
      )}
    </div>
  );
}

export function NotConfigured() {
  return (
    <div className="note">
      ⚙️ <b>Configuration à terminer :</b> les variables NEXT_PUBLIC_SUPABASE_URL et
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ne sont pas encore renseignées.
    </div>
  );
}

export function LoadError() {
  return <div className="info">Impossible de charger les lieux. Vérifiez votre connexion.</div>;
}
