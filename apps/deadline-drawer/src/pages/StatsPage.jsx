import MonthlySummary from '../components/MonthlySummary'
import DeadlineCard from '../components/DeadlineCard'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import { getCategoryIconName } from '../components/iconNames'
import {
  getMonthItems,
  getMonthStats,
  countByCategory,
  countByImportance,
  getMissedItems,
} from '../utils/statsUtils'
import { getCompletedItems } from '../utils/deadlineFilters'
import './StatsPage.css'

const IMPORTANCE_ICON = { high: 'warn', medium: 'dot', low: 'arrowDown' }

// 라이브러리 없이 CSS 막대만으로 개수를 표현.
function CountBars({ rows }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <ul className="bars">
      {rows.map((r) => (
        <li className="bar" key={r.id}>
          <span className="bar__chip" data-color={r.color || 'neutral'}>
            {r.icon ? (
              <Icon name={getCategoryIconName(r.id)} size={16} />
            ) : (
              <Icon name={IMPORTANCE_ICON[r.id]} size={16} />
            )}
          </span>
          <span className="bar__label">{r.label}</span>
          <span className="bar__track">
            <span
              className="bar__fill"
              data-color={r.color}
              style={{ width: `${(r.count / max) * 100}%` }}
            />
          </span>
          <span className="bar__count">{r.count}</span>
        </li>
      ))}
    </ul>
  )
}

export default function StatsPage({ deadlines = [], categories = [], onOpenItem }) {
  const base = new Date()
  const monthLabel = `${base.getFullYear()}년 ${base.getMonth() + 1}월`

  const monthItems = getMonthItems(deadlines, base)
  const stats = getMonthStats(monthItems)
  const categoryRows = countByCategory(monthItems, categories)
  const importanceRows = countByImportance(monthItems)
  const completed = getCompletedItems(monthItems)
  const missed = getMissedItems(monthItems)

  return (
    <section className="stats-page">
      <header className="stats-page__head">
        <h1 className="stats-page__title">기록</h1>
        <span className="stats-page__month">{monthLabel}</span>
      </header>

      <MonthlySummary stats={stats} />

      {stats.total === 0 ? (
        <EmptyState
          icon="📊"
          title="이번 달 기록이 아직 없어요"
          hint="마감일이 이번 달인 기한이 생기면 여기에 모여요."
        />
      ) : (
        <>
          <section className="stats-block">
            <h2 className="stats-block__title">카테고리별</h2>
            {categoryRows.length > 0 ? (
              <CountBars rows={categoryRows} />
            ) : (
              <p className="stats-block__empty">표시할 카테고리가 없어요.</p>
            )}
          </section>

          <section className="stats-block">
            <h2 className="stats-block__title">중요도별</h2>
            <CountBars rows={importanceRows} />
          </section>

          <section className="stats-block">
            <h2 className="stats-block__title">
              완료한 항목
              <span className="stats-block__count">{completed.length}</span>
            </h2>
            {completed.length > 0 ? (
              <ul className="stats-list">
                {completed.map((item) => (
                  <li key={item.id}>
                    <DeadlineCard item={item} onOpen={onOpenItem} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="stats-block__empty">아직 완료한 항목이 없어요.</p>
            )}
          </section>

          <section className="stats-block">
            <h2 className="stats-block__title">
              놓친 항목
              <span className="stats-block__count stats-block__count--danger">
                {missed.length}
              </span>
            </h2>
            {missed.length > 0 ? (
              <ul className="stats-list">
                {missed.map((item) => (
                  <li key={item.id}>
                    <DeadlineCard item={item} onOpen={onOpenItem} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="stats-block__empty">놓친 항목이 없어요. 좋아요.</p>
            )}
          </section>
        </>
      )}
    </section>
  )
}
