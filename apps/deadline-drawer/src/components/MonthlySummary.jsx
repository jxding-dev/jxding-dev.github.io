import StatBox from './StatBox'
import './MonthlySummary.css'

// 이번 달 요약: 4개 수치(2열) + 완료율 막대.
export default function MonthlySummary({ stats }) {
  const { total, completed, overdue, onHold, rate } = stats

  return (
    <div className="monthly-summary">
      <div className="monthly-summary__grid">
        <StatBox label="전체 등록" value={total} icon="doc" color="accent" />
        <StatBox label="완료" value={completed} icon="check" color="ok" />
        <StatBox label="기한 지남" value={overdue} icon="clock" color="danger" />
        <StatBox label="보류" value={onHold} icon="folder" color="neutral" />
      </div>

      <div className="completion">
        <div className="completion__head">
          <span className="completion__label">완료율</span>
          <span className="completion__value">{rate}%</span>
        </div>
        <div className="completion__track">
          <div className="completion__fill" style={{ width: `${rate}%` }} />
        </div>
      </div>
    </div>
  )
}
