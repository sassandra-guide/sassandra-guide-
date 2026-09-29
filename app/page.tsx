import Link from "next/link";
import { CATS, isConfigured } from "@/lib/data";
import { getLieux } from "@/lib/lieux";
import { Card, LoadError, NotConfigured } from "@/components/ui";

export default async function Home() {
  if (!isConfigured()) return <NotConfigured />;
  const lieux = await getLieux();
  if (!lieux) return <LoadError />;

  const decouvrir = lieux.slice(0, 6);
  const verifies = lieux
    .filter((l) => !l.is_demo && l.statut_verification === "verifie")
    .slice(0, 6);

  return (
    <>
      <section className="hero">
        <h1>Bienvenue à Sassandra</h1>
        <p>
          Le guide numérique pour trouver facilement hôtels, restaurants, plages, services et
          bonnes adresses.
        </p>
        <form className="search" action="/recherche">
          <input name="q" type="search" placeholder="Que cherchez-vous ?" aria-label="Rechercher" />
          <button>Chercher</button>
        </form>
      </section>

      <h2>Catégories</h2>
      <div className="grid">
        {Object.entries(CATS).map(([k, c]) => (
          <Link key={k} className="cat" href={`/recherche?cat=${k}`}>
            <span>{c[1]}</span>
            {c[0]}
          </Link>
        ))}
      </div>

      <h2>À découvrir</h2>
      {decouvrir.length ? (
        decouvrir.map((l) => <Card key={l.id} l={l} />)
      ) : (
        <div className="info">Aucun lieu pour le moment.</div>
      )}

      <h2>Informations vérifiées</h2>
      {verifies.length ? (
        verifies.map((l) => <Card key={l.id} l={l} />)
      ) : (
        <div className="info">
          Les premières fiches vérifiées par notre équipe arriveront bientôt.
        </div>
      )}

      <Link
        className="btn sea"
        style={{ display: "block", textAlign: "center", marginTop: 14 }}
        href="/recherche"
      >
        Voir tous les lieux
      </Link>
    </>
  );
}
