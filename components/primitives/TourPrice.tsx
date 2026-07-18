import { type Locale } from "@/lib/i18n/config";
import { type LocalizedPrice } from "@/lib/currency/types";

const labels: Record<
  Locale,
  { from: string; price: string; approximate: string; attribution: string }
> = {
  es: {
    from: "Desde",
    price: "Precio",
    approximate: "Precio aproximado",
    attribution: "Tipo de cambio por ExchangeRate-API",
  },
  en: {
    from: "From",
    price: "Price",
    approximate: "Approximate price",
    attribution: "Exchange rates by ExchangeRate-API",
  },
  pt: {
    from: "A partir de",
    price: "Preço",
    approximate: "Preço aproximado",
    attribution: "Câmbio por ExchangeRate-API",
  },
};

function numberLocale(locale: Locale): string {
  if (locale === "en") return "en-US";
  if (locale === "pt") return "pt-BR";
  return "es-AR";
}

export function formatTourPrice(price: LocalizedPrice, locale: Locale): string {
  return new Intl.NumberFormat(numberLocale(locale), {
    style: "currency",
    currency: price.currency,
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(price.amount);
}

type TourPriceProps = {
  price: LocalizedPrice;
  locale: Locale;
  kind?: "from" | "exact";
  tone?: "paper" | "red";
  className?: string;
};

export function TourPrice({
  price,
  locale,
  kind = "from",
  tone = "paper",
  className = "",
}: TourPriceProps) {
  const label = price.converted
    ? labels[locale].approximate
    : kind === "from"
      ? labels[locale].from
      : labels[locale].price;

  return (
    <p
      className={[
        "font-display flex flex-wrap items-baseline gap-x-2 uppercase",
        tone === "paper" ? "text-accent-on-paper" : "text-paper",
        className,
      ].join(" ")}
    >
      <span className="text-[0.64rem] tracking-[var(--tracking-cta)] opacity-70">{label}</span>
      <span className="text-2xl leading-none">{formatTourPrice(price, locale)}</span>
    </p>
  );
}

export function ExchangeRateAttribution({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <p className={`font-sans text-xs opacity-65 ${className}`}>
      <a
        href="https://www.exchangerate-api.com"
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-4 hover:opacity-75"
      >
        {labels[locale].attribution}
      </a>
    </p>
  );
}
