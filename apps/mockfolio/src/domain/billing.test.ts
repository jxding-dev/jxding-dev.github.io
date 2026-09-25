import { describe, it, expect } from 'vitest';
import { betaBilling, billing, BILLING_ENABLED } from './billing';
import { PlanTier } from './plans';
import { canUseFeature, FeatureKey } from './features';

const anyUser = { id: 'u1', email: 'a@b.com', name: null, avatarUrl: null };

describe('beta billing seam', () => {
  it('keeps every user on Free until a real provider is wired in', () => {
    expect(BILLING_ENABLED).toBe(false);
    expect(betaBilling.resolvePlan(null)).toBe(PlanTier.Free);
    expect(betaBilling.resolvePlan(anyUser)).toBe(PlanTier.Free);
    expect(billing.resolvePlan(anyUser)).toBe(PlanTier.Free);
  });

  it('reports checkout as unavailable with a user-facing message', async () => {
    const result = await betaBilling.startCheckout(anyUser);
    expect(result.status).toBe('unavailable');
    expect(result.message).toBeTruthy();
  });

  it('gates Pro features for the Free plan but keeps Free features open', () => {
    expect(canUseFeature(PlanTier.Free, FeatureKey.PngExport)).toBe(true);
    expect(canUseFeature(PlanTier.Free, FeatureKey.CustomPngMockups)).toBe(false);
    expect(canUseFeature(PlanTier.Pro, FeatureKey.CustomPngMockups)).toBe(true);
  });
});
