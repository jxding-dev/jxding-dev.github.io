import Icon from './Icon'
import './SummaryCard.css'

// 홈 상단 요약 카드 1개. 아이콘 칩 + 큰 숫자 + 라벨 + 진행률 바.
// tone: 'today' | 'overdue' | 'neutral', ratio: 0~1 (전체 대비 비중)
export default function SummaryCard({ label, count, tone = 'neutral', ratio = 0 }) {
  const iconName = tone === 'overdue' ? 'clock' : 'calendar'
  const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100)
  return (
    <div className="summary-card" data-tone={tone} data-empty={count === 0}>
      <span className="summary-card__icon">
        <Icon name={iconName} size={18} />
      </span>
      <span className="summary-card__count">{count}</span>
      <span className="summary-card__label">{label}</span>
      <div
        className="summary-card__bar"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="summary-card__bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
