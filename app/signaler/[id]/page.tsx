import Link from "next/link";
import { isConfigured } from "@/lib/data";
import { getLieu } from "@/lib/lieux";
import { NotConfigured } from "@/components/ui";
import ReportForm from "@/components/ReportForm";

export default async function SignalerPage({ params }: { params: Promise<{ id: string }> }) {
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
  return <ReportForm id={l.id} nom={l.nom} />;
}
