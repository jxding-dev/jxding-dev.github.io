import Icon from './Icon'
import './StatBox.css'

// 기록 화면 통계 카드: 아이콘 칩 + 큰 숫자 + 라벨 + 화살표.
// color: 'accent' | 'ok' | 'danger' | 'neutral'
export default function StatBox({ label, value, icon, color = 'neutral' }) {
  return (
    <div className="stat-box" data-color={color}>
      <span className="stat-box__icon">
        <Icon name={icon} size={19} />
      </span>
      <div className="stat-box__text">
        <span className="stat-box__value">{value}</span>
        <span className="stat-box__label">{label}</span>
      </div>
      <span className="stat-box__chevron" aria-hidden="true">›</span>
    </div>
  )
}
