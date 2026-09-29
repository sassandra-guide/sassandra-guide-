import Link from "next/link";
import { CATS, ROUTE, VERIF, destination, isConfigured, isNum } from "@/lib/data";
import { getLieu } from "@/lib/lieux";
import { Badge, NotConfigured, Photos, Val } from "@/components/ui";

export default async function LieuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isConfigured()) return <NotConfigured />;

  const l = await getLieu(id);
  if (!l) {
    return (
      <>
        <div className="info">Ce lieu est introuvable.</div>
        <Link
          className="btn sea"
          style={{ display: "block", textAlign: "center", marginTop: 12 }}
          href="/"
        >
          Retour à l&apos;accueil
        </Link>
      </>
    );
  }

  const c = CATS[l.categorie] || CATS.autres;
  const r = ROUTE[l.etat_route ?? ""] || ROUTE.non_verifie;
  const v = VERIF[l.statut_verification ?? ""] || VERIF.a_verifier;
  const hasMain = isNum(l.latitude) && isNum(l.longitude);
  const hasEntry = isNum(l.coordonnees_entree_lat) && isNum(l.coordonnees_entree_lng);
  const dest = destination(l);
  const digits = String(l.whatsapp || "").replace(/\D/g, "");
  const date = l.date_derniere_verification
    ? new Date(l.date_derniere_verification + "T00:00:00").toLocaleDateString("fr-FR")
    : "Pas encore vérifié";
  const services = l.services ?? [];

  return (
    <>
      <Link href="/recherche" style={{ color: "var(--sea)", fontWeight: 700 }}>
        ‹ Retour aux lieux
      </Link>
      <Photos photos={l.photos ?? []} emoji={c[1]} alt={l.nom} />

      {l.is_demo && (
        <div className="note">
          🧪 <b>Fiche de démonstration.</b> Ces informations sont fictives et servent uniquement à
          tester l&apos;application.
        </div>
      )}

      <h1 style={{ margin: "0 0 4px", fontSize: 22 }}>{l.nom}</h1>
      <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>
        {c[0]}
        {l.sous_categorie ? " · " + l.sous_categorie : ""}
      </p>
      <p style={{ margin: "0 0 10px" }}>
        <Badge l={l} /> <span className={`b ${r[2]}`}>{r[0]} {r[1]}</span>
      </p>

      <div className="actions">
        {l.telephone ? (
          <a className="btn sea" href={`tel:${l.telephone.replace(/\s/g, "")}`}>📞 Appeler</a>
        ) : (
          <span className="btn off">📞 Numéro à vérifier</span>
        )}
        {digits ? (
          <a className="btn wa" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">
            💬 WhatsApp
          </a>
        ) : (
          <span className="btn off">💬 WhatsApp à vérifier</span>
        )}
        {dest ? (
          <a
            className="btn full"
            href={`https://www.google.com/maps/dir/?api=1&destination=${dest[0]},${dest[1]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🧭 Itinéraire
          </a>
        ) : (
          <span className="btn off full">🧭 Localisation à vérifier</span>
        )}
      </div>

      <div className="box">
        <h3>Description</h3>
        <Val v={l.description} />
      </div>

      <div className="box">
        <h3>Informations pratiques</h3>
        <div className="row"><b>Adresse :</b> <Val v={l.adresse} /></div>
        <div className="row"><b>Quartier :</b> <Val v={l.quartier} /></div>
        <div className="row"><b>Point de repère :</b> <Val v={l.point_repere} /></div>
        <div className="row"><b>Horaires :</b> <Val v={l.horaires} /></div>
        <div className="row"><b>Téléphone :</b> <Val v={l.telephone} /></div>
      </div>

      <div className="box">
        <h3>Services</h3>
        {services.length ? (
          <div className="tags">
            {services.map((s) => <span key={s} className="tag">{s}</span>)}
          </div>
        ) : (
          <Val v="" />
        )}
      </div>

      <div className="box">
        <h3>Localisation</h3>
        <div className="row">
          <b>Coordonnées :</b>{" "}
          {hasMain ? `${l.latitude!.toFixed(5)}, ${l.longitude!.toFixed(5)}` : <span className="unk">À vérifier</span>}
        </div>
        <div className="row">
          <b>Entrée :</b>{" "}
          {hasEntry
            ? `${l.coordonnees_entree_lat!.toFixed(5)}, ${l.coordonnees_entree_lng!.toFixed(5)}`
            : <span className="unk">À vérifier</span>}
        </div>
        {dest && (
          <div className="row">
            <a
              style={{ color: "var(--sea)", fontWeight: 700 }}
              href={`https://www.google.com/maps/search/?api=1&query=${dest[0]},${dest[1]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🗺️ Voir sur la carte
            </a>
          </div>
        )}
        <div className="row"><b>État de la route :</b> {r[0]} {r[1]}</div>
      </div>

      <div className="box">
        <h3>Vérification</h3>
        <div className="row">
          <b>Statut :</b> {l.is_demo ? "🧪 Donnée de démonstration" : `${v[0]} ${v[1]}`}
        </div>
        <div className="row"><b>Dernière vérification :</b> {l.is_demo ? "—" : date}</div>
      </div>

      <Link className="btn line" style={{ display: "block", textAlign: "center" }} href={`/signaler/${l.id}`}>
        ⚠️ Signaler une information incorrecte
      </Link>
    </>
  );
}
