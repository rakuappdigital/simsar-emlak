export const COMMISSION_RATE = 0.03;

export const formatTL = (amount: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(amount);
