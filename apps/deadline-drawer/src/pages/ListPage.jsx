import { useState } from 'react'
import FilterTabs from '../components/FilterTabs'
import CategoryChips from '../components/CategoryChips'
import DeadlineCard from '../components/DeadlineCard'
import EmptyState from '../components/EmptyState'
import QuickAddButton from '../components/QuickAddButton'
import { getListItems } from '../utils/deadlineFilters'
import { DEFAULT_LIST_FILTER } from '../data/listFilters'
import './ListPage.css'

// 전체 기한 목록. 상태 필터 + 카테고리 필터 + 마감일 정렬.
export default function ListPage({
  deadlines = [],
  initialFilter = DEFAULT_LIST_FILTER,
  categories,
  onOpenItem,
  onQuickAdd,
}) {
  const [filter, setFilter] = useState(initialFilter)
  const [category, setCategory] = useState('all')

  const base =
    category === 'all'
      ? deadlines
      : deadlines.filter((i) => i.category === category)
  const items = getListItems(base, filter)

  return (
    <section className="list-page">
      <header className="list-page__head">
        <h1 className="list-page__title">전체 기한</h1>
        <span className="list-page__count">{items.length}건</span>
      </header>

      <FilterTabs active={filter} onChange={setFilter} />
      <CategoryChips
        active={category}
        onChange={setCategory}
        categories={categories}
      />

      {items.length > 0 ? (
        <ul className="list-page__list">
          {items.map((item) => (
            <li key={item.id}>
              <DeadlineCard item={item} onOpen={onOpenItem} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon="🔍"
          title="조건에 맞는 기한이 없어요"
          hint="필터나 카테고리를 바꿔보세요."
        />
      )}

      {onQuickAdd && <QuickAddButton onClick={onQuickAdd} />}
    </section>
  )
}
