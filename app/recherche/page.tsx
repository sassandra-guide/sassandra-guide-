import { isConfigured } from "@/lib/data";
import { getLieux } from "@/lib/lieux";
import { LoadError, NotConfigured } from "@/components/ui";
import SearchClient from "@/components/SearchClient";

type Props = { searchParams: Promise<{ q?: string; cat?: string }> };

export default async function RecherchePage({ searchParams }: Props) {
  const { q = "", cat = "" } = await searchParams;
  if (!isConfigured()) return <NotConfigured />;
  const lieux = await getLieux();
  if (!lieux) return <LoadError />;
  return <SearchClient key={`${cat}|${q}`} lieux={lieux} q={q} cat={cat} />;
}
