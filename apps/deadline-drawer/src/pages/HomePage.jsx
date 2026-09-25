import SummaryCard from '../components/SummaryCard'
import DeadlineCard from '../components/DeadlineCard'
import EmptyState from '../components/EmptyState'
import QuickAddButton from '../components/QuickAddButton'
import {
  getDueTodayItems,
  getThisWeekItems,
  getOverdueItems,
  getUrgentItems,
  trackable,
} from '../utils/deadlineFilters'
import './HomePage.css'

// 홈 = "위험한 기한 알림판". 지금 터질 기한을 가장 먼저 보여준다.
export default function HomePage({
  deadlines = [],
  onOpenItem,
  onQuickAdd,
  onViewAll,
}) {
  const todayCount = getDueTodayItems(deadlines).length
  const weekCount = getThisWeekItems(deadlines).length
  const overdueCount = getOverdueItems(deadlines).length
  const urgent = getUrgentItems(deadlines)

  // 진행률 바: 진행 중(미완료·보류 제외) 기한 대비 각 버킷 비중
  const trackableCount = trackable(deadlines).length
  const ratio = (n) => (trackableCount ? n / trackableCount : 0)

  return (
    <section className="home">
      <div className="home__summary">
        <SummaryCard
          label="오늘 마감"
          count={todayCount}
          tone="today"
          ratio={ratio(todayCount)}
        />
        <SummaryCard
          label="이번 주"
          count={weekCount}
          tone="neutral"
          ratio={ratio(weekCount)}
        />
        <SummaryCard
          label="기한 지남"
          count={overdueCount}
          tone="overdue"
          ratio={ratio(overdueCount)}
        />
      </div>

      <div className="home__section">
        <div className="home__section-head">
          <h2 className="home__heading">
            지금 챙겨야 할 기한
            {urgent.length > 0 && (
              <span className="home__heading-count">{urgent.length}</span>
            )}
          </h2>
          {onViewAll && (
            <button type="button" className="home__view-all" onClick={onViewAll}>
              전체보기 ›
            </button>
          )}
        </div>

        {urgent.length > 0 ? (
          <ul className="home__list">
            {urgent.map((item) => (
              <li key={item.id}>
                <DeadlineCard item={item} onOpen={onOpenItem} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon="✅"
            title="지금 터질 기한은 없어요"
            hint="오늘 마감이나 기한 지난 일이 생기면 여기에 바로 떠요."
          />
        )}
      </div>

      <QuickAddButton onClick={onQuickAdd} />
    </section>
  )
}
