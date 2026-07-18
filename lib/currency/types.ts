export const currencyCodes = ["ARS", "USD", "BRL", "EUR"] as const;

export type CurrencyCode = (typeof currencyCodes)[number];

export type Money = {
  amount: number;
  currency: CurrencyCode;
};

export type LocalizedPrice = Money & {
  sourceAmount: number;
  sourceCurrency: CurrencyCode;
  converted: boolean;
};
