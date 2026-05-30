import { notFound, permanentRedirect } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function JournalPostRedirect({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  permanentRedirect(`/${locale}/taller-de-rutas/${slug}`);
}
