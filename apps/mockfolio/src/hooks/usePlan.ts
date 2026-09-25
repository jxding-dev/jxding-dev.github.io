import { useMemo } from 'react';
import { useAuth } from './authContext';
import { billing, BILLING_ENABLED, type CheckoutResult } from '../domain/billing';
import { PlanTier } from '../domain/plans';
import { canUseFeature, type FeatureKey } from '../domain/features';

export interface PlanState {
  /** The user's active plan (Free during beta). */
  plan: PlanTier;
  isPro: boolean;
  /** True once a real payment provider is wired in. */
  billingEnabled: boolean;
  /** Whether the current plan unlocks a given feature. */
  canUse: (feature: FeatureKey) => boolean;
  /** Start the upgrade/checkout flow for the current user. */
  startCheckout: () => Promise<CheckoutResult>;
}

/**
 * Single source of truth for plan entitlement at runtime. UI reads the plan and
 * gates features through here rather than hardcoding `Free`, so the payment
 * system only has to be wired into `billing` (see domain/billing.ts).
 */
export function usePlan(): PlanState {
  const { user } = useAuth();
  return useMemo(() => {
    const plan = billing.resolvePlan(user);
    return {
      plan,
      isPro: plan === PlanTier.Pro,
      billingEnabled: BILLING_ENABLED,
      canUse: (feature: FeatureKey) => canUseFeature(plan, feature),
      startCheckout: () => billing.startCheckout(user),
    };
  }, [user]);
}
