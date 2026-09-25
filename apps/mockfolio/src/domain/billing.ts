import type { AuthUser } from '../hooks/authContext';
import { PlanTier } from './plans';

/**
 * Single seam for the payment system.
 *
 * Every place that gates a Pro feature or offers an upgrade routes through this
 * module (via the `usePlan` hook), so turning billing on later is exactly two
 * steps — no UI or feature-gating code has to change:
 *
 *   1. Implement a real `BillingService` (subscription lookup + checkout).
 *   2. Point `billing` at it and set `BILLING_ENABLED = true`.
 */
export const BILLING_ENABLED = false;

export interface CheckoutResult {
  /** 'unavailable' during beta; 'redirected' once a provider is wired. */
  status: 'unavailable' | 'redirected' | 'error';
  /** User-facing message to show when the checkout did not start. */
  message?: string;
}

export interface BillingService {
  /** Resolve the user's active plan. Anonymous or unknown → Free. */
  resolvePlan(user: AuthUser | null): PlanTier;
  /** Begin an upgrade. During beta this reports 'unavailable'. */
  startCheckout(user: AuthUser | null): Promise<CheckoutResult>;
}

/**
 * Beta billing: no payment provider yet, so everyone is on Free and checkout is
 * not available.
 *
 * TODO(payment): replace with a provider-backed service —
 *   - `resolvePlan`: read the active subscription (e.g. a Supabase `subscriptions`
 *     row kept in sync by the provider's webhook) and return Pro/Free.
 *   - `startCheckout`: create a provider checkout session for `user` and return
 *     `{ status: 'redirected' }` after sending them to the hosted checkout.
 */
export const betaBilling: BillingService = {
  resolvePlan() {
    return PlanTier.Free;
  },
  async startCheckout() {
    return {
      status: 'unavailable',
      message: '현재 베타 기간에는 모든 기능을 무료로 사용할 수 있어요. 결제는 정식 출시 후 열립니다.',
    };
  },
};

/** The active billing service. Swap this when a real provider is added. */
export const billing: BillingService = betaBilling;
