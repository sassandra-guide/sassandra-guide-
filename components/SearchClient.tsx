"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CATS, norm, type Lieu } from "@/lib/data";
import { Card } from "@/components/ui";

export default function SearchClient({ lieux, q: q0, cat }: { lieux: Lieu[]; q: string; cat: string }) {
  const [q, setQ] = useState(q0);

  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    return lieux.filter((l) => {
      if (cat && l.categorie !== cat) return false;
      const hay = norm(
        [l.nom, l.sous_categorie, l.quartier, l.adresse, (CATS[l.categorie] || [""])[0]].join(" ")
      );
      return words.every((w) => hay.includes(w));
    });
  }, [q, cat, lieux]);

  return (
    <>
      <div className="search" style={{ marginBottom: 10 }}>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nom, quartier, catégorie…"
          aria-label="Rechercher"
          style={{ border: "1px solid var(--line)" }}
        />
      </div>
      <div className="chips">
        <Link className={"chip" + (cat ? "" : " on")} href="/recherche">Tout</Link>
        {Object.entries(CATS).map(([k, c]) => (
          <Link key={k} className={"chip" + (cat === k ? " on" : "")} href={`/recherche?cat=${k}`}>
            {c[1]} {c[0]}
          </Link>
        ))}
      </div>
      {results.length ? (
        <>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>{results.length} résultat(s)</p>
          {results.map((l) => <Card key={l.id} l={l} />)}
        </>
      ) : (
        <div className="info">Aucun résultat. Essayez un autre mot ou une autre catégorie.</div>
      )}
    </>
  );
}
