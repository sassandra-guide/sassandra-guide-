"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { REPORTS, isConfigured } from "@/lib/data";

export default function ReportForm({ id, nom }: { id: string; nom: string }) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // piège anti-robots (champ caché)
    const type = String(fd.get("type") || "");
    if (!type) { setMsg("Choisissez d'abord le type de problème."); return; }
    if (!isConfigured()) { setMsg("Le site n'est pas encore configuré."); return; }
    try {
      const last = Number(localStorage.getItem("sg_last")) || 0;
      if (Date.now() - last < 60000) { setMsg("Merci de patienter une minute avant un nouvel envoi."); return; }
    } catch {}
    setBusy(true);
    setMsg("");
    // Le public peut seulement AJOUTER un signalement (statut « en_attente » par défaut).
    const { error } = await createClient().from("signalements").insert({
      lieu_id: id,
      type_signalement: type,
      description: String(fd.get("description") || "").trim() || null,
      contact: String(fd.get("contact") || "").trim() || null,
    });
    if (error) {
      setBusy(false);
      setMsg("L'envoi a échoué. Vérifiez votre connexion et réessayez.");
      return;
    }
    try { localStorage.setItem("sg_last", String(Date.now())); } catch {}
    setDone(true);
  }

  if (done) {
    return (
      <div className="box" style={{ textAlign: "center", padding: "28px 16px" }}>
        <div style={{ fontSize: 44 }}>🙏</div>
        <h2>Merci.</h2>
        <p>Votre signalement sera vérifié par notre équipe.</p>
        <Link className="btn sea" style={{ display: "block" }} href={`/lieu/${id}`}>Retour à la fiche</Link>
      </div>
    );
  }

  return (
    <>
      <Link href={`/lieu/${id}`} style={{ color: "var(--sea)", fontWeight: 700 }}>‹ Retour à la fiche</Link>
      <h1 style={{ fontSize: 20, margin: "12px 0 4px" }}>Signaler une information incorrecte</h1>
      <p style={{ color: "var(--muted)", margin: "0 0 12px" }}>{nom}</p>
      <form onSubmit={onSubmit}>
        {REPORTS.map(([k, t]) => (
          <label className="opt" key={k}><input type="radio" name="type" value={k} /> {t}</label>
        ))}
        <h2 style={{ fontSize: 15 }}>Précisions (facultatif)</h2>
        <textarea name="description" rows={3} placeholder="Ex : le numéro ne répond plus…" />
        <h2 style={{ fontSize: 15 }}>Votre contact (facultatif)</h2>
        <input type="text" name="contact" placeholder="Téléphone ou e-mail" />
        <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" />
        <p style={{ color: "var(--bad)", fontWeight: 600 }}>{msg}</p>
        <button className="btn" style={{ width: "100%" }} disabled={busy}>
          {busy ? "Envoi…" : "Envoyer le signalement"}
        </button>
      </form>
    </>
  );
}
