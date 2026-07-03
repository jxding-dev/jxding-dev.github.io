import type { ReactNode } from 'react';
import styles from './HelpNote.module.css';

interface Props {
  /** Short label shown next to the ⓘ icon in the always-visible summary. */
  summary: string;
  /** Optional tone; matches the surrounding message. */
  tone?: 'info' | 'warn';
  children: ReactNode;
}

/**
 * Collapsible help affordance. The summary line stays visible; clicking it
 * expands a plain-language explanation. Uses native <details> so it works
 * without JS state and is keyboard-accessible.
 */
export function HelpNote({ summary, tone = 'info', children }: Props) {
  return (
    <details className={`${styles.help} ${tone === 'warn' ? styles.warn : styles.info}`}>
      <summary className={styles.summary}>
        <span className={styles.icon} aria-hidden>ⓘ</span>
        <span>{summary}</span>
        <span className={styles.chevron} aria-hidden>⌄</span>
      </summary>
      <div className={styles.body}>{children}</div>
    </details>
  );
}
