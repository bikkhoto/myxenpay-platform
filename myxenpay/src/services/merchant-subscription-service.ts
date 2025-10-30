/*
  MerchantSubscriptionService
  - Centralizes subscription tier definitions and pricing for merchants
  - Designed for DB integration via an injected repository interface

  Tiers
  - FREE: $0/mo, 0.07% fee, 10 QR codes, basic features
  - PRO: $9/mo, 0.07% fee, unlimited QR codes, advanced features
  - BUSINESS: $49/mo, 0.07% fee, unlimited QR codes, business features
*/

export type TierName = "FREE" | "PRO" | "BUSINESS";

export type TierInfo = {
  name: TierName;
  monthlyPriceUSD: number;
  maxQRCodes: number; // use Number.POSITIVE_INFINITY for unlimited
  features: string[];
  feeRate: number; // e.g., 0.0007 (0.07%)
};

export type Addon = { id: string; price: number };

export const TIERS: Record<TierName, TierInfo> = {
  FREE: {
    name: "FREE",
    monthlyPriceUSD: 0,
    maxQRCodes: 10,
    features: ["basic_dashboard", "email_support"],
    feeRate: 0.0007,
  },
  PRO: {
    name: "PRO",
    monthlyPriceUSD: 9,
    maxQRCodes: Number.POSITIVE_INFINITY,
    features: ["advanced_analytics", "custom_branding", "api_access", "priority_support"],
    feeRate: 0.0007,
  },
  BUSINESS: {
    name: "BUSINESS",
    monthlyPriceUSD: 49,
    maxQRCodes: Number.POSITIVE_INFINITY,
    features: ["multi_location", "team_accounts", "advanced_reporting", "webhooks", "dedicated_support"],
    feeRate: 0.0007,
  },
};

export interface MerchantSubscriptionRepo {
  // Return merchant profile containing at least tier name and optional addons
  getMerchantProfile(merchantId: string): Promise<{ tier: TierName; addons?: Addon[] } | null>;
  // Return usage stats required for limit checks, e.g., number of generated QR codes
  getUsage(merchantId: string): Promise<{ qrCodes: number; [k: string]: number }>;
}

function tierOrder(t: TierName): number {
  switch (t) {
    case "FREE": return 0;
    case "PRO": return 1;
    case "BUSINESS": return 2;
  }
}

export class MerchantSubscriptionService {
  constructor(private readonly repo: MerchantSubscriptionRepo) {}

  getTierFeatures(tierName: TierName): string[] {
    return TIERS[tierName].features.slice();
  }

  calculateMonthlyPrice(tier: TierName, addons: Addon[] = []) {
    const base = TIERS[tier].monthlyPriceUSD;
    const addonsTotal = addons.reduce((sum, a) => sum + (Number.isFinite(a.price) ? a.price : 0), 0);
    const total = base + addonsTotal;
    return { currency: "USD" as const, base, addonsTotal, total };
  }

  async checkUsageLimits(merchantId: string, feature: string) {
    const profile = await this.repo.getMerchantProfile(merchantId);
    const tier = profile?.tier ?? "FREE";
    const usage = await this.repo.getUsage(merchantId);
    const t = TIERS[tier];

    // Currently enforce limit on QR codes only
    if (feature === "qrcodes" || feature === "qr_codes" || feature === "maxQRCodes") {
      const used = usage.qrCodes ?? 0;
      const limit = t.maxQRCodes;
      const withinLimit = used < limit;
      return { feature: "qrcodes", used, limit, withinLimit };
    }

    // For unknown feature checks, assume no limit by default
    return { feature, used: 0, limit: Number.POSITIVE_INFINITY, withinLimit: true };
  }

  canUpgradeTier(currentTier: TierName, targetTier: TierName): boolean {
    return tierOrder(targetTier) > tierOrder(currentTier);
  }

  getTierComparison() {
    // Basic comparison payload; extend into a feature matrix as needed
    return {
      tiers: [TIERS.FREE, TIERS.PRO, TIERS.BUSINESS].map((t) => ({
        name: t.name,
        monthlyPriceUSD: t.monthlyPriceUSD,
        feeRate: t.feeRate,
        maxQRCodes: t.maxQRCodes,
        features: t.features.slice(),
      })),
    } as const;
  }
}

// Factory helper
export function createMerchantSubscriptionService(repo: MerchantSubscriptionRepo) {
  return new MerchantSubscriptionService(repo);
}
