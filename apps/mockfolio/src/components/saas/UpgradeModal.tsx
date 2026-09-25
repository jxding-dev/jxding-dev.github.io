import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { usePlan } from '../../hooks/usePlan';
import styles from './UpgradeModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Shared upgrade dialog. During beta it explains that everything is free; once
 * billing is enabled it drives the checkout via the billing seam. No caller
 * needs to change when the payment system is added.
 */
export function UpgradeModal({ open, onClose }: Props) {
  const { billingEnabled, startCheckout } = usePlan();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    setMessage(null);
    const result = await startCheckout();
    setLoading(false);
    // On success a real provider redirects to checkout; only surface failures.
    if (result.status !== 'redirected') {
      setMessage(result.message ?? '지금은 업그레이드를 진행할 수 없어요.');
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={billingEnabled ? 'Pro로 업그레이드' : 'Pro는 준비 중이에요'}>
      <div className={styles.body}>
        <div className={styles.emoji} aria-hidden>Pro</div>
        <p>
          현재 베타 기간에는 모든 기능을 무료로 사용할 수 있어요.
          <br />
          결제가 열리면 저장한 작업과 고해상도 내보내기가 Pro에 연결됩니다.
        </p>
        {message && <p className={styles.notice}>{message}</p>}
        {billingEnabled ? (
          <Button variant="primary" fullWidth loading={loading} onClick={handleUpgrade}>Pro 구독하기</Button>
        ) : (
          <Button variant="primary" fullWidth onClick={onClose}>확인</Button>
        )}
      </div>
    </Modal>
  );
}
