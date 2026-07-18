import "server-only";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import { type Locale } from "@/lib/i18n/config";
import { type CurrencyCode, type LocalizedPrice, type Money } from "@/lib/currency/types";

export type { LocalizedPrice } from "@/lib/currency/types";

const EXCHANGE_RATE_API_URL = "https://open.er-api.com/v6/latest/ARS";
const EXCHANGE_RATE_REVALIDATE_SECONDS = 86_400;

const ExchangeRateResponseSchema = z.object({
  result: z.literal("success"),
  base_code: z.literal("ARS"),
  rates: z.record(z.string(), z.number().positive()),
});

async function fetchArsRates(): Promise<Record<string, number>> {
  const response = await fetch(EXCHANGE_RATE_API_URL, {
    headers: { Accept: "application/json" },
    next: { revalidate: EXCHANGE_RATE_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Exchange rate request failed with status ${response.status}`);
  }

  return ExchangeRateResponseSchema.parse(await response.json()).rates;
}

const getCachedArsRates = unstable_cache(fetchArsRates, ["currency:ars-rates:v1"], {
  revalidate: EXCHANGE_RATE_REVALIDATE_SECONDS,
  tags: ["exchange-rates"],
});

function targetCurrency(locale: Locale): CurrencyCode | null {
  if (locale === "en") return "USD";
  if (locale === "pt") return "BRL";
  return null;
}

function unchangedPrice(price: Money): LocalizedPrice {
  return {
    ...price,
    sourceAmount: price.amount,
    sourceCurrency: price.currency,
    converted: false,
  };
}

/**
 * Convert ARS prices for EN/PT visitors. Other source currencies remain as
 * entered in Sheets so the site never silently changes a client's quoted
 * currency.
 */
export async function localizePrices(prices: Money[], locale: Locale): Promise<LocalizedPrice[]> {
  const target = targetCurrency(locale);
  const needsRates = target && prices.some((price) => price.currency === "ARS" && price.amount > 0);

  if (!needsRates) return prices.map(unchangedPrice);

  try {
    const rates = await getCachedArsRates();
    const rate = rates[target];
    if (!rate) throw new Error(`Exchange rate response is missing ${target}`);

    return prices.map((price) =>
      price.currency === "ARS" && price.amount > 0
        ? {
            amount: price.amount * rate,
            currency: target,
            sourceAmount: price.amount,
            sourceCurrency: price.currency,
            converted: true,
          }
        : unchangedPrice(price),
    );
  } catch (error) {
    console.error("[currency] ARS conversion failed; preserving source prices", error);
    return prices.map(unchangedPrice);
  }
}
