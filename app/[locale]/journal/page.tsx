import { notFound, permanentRedirect } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function JournalRedirect({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  permanentRedirect(`/${locale}/taller-de-rutas`);
}
