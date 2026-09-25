import { LIST_FILTERS } from '../data/listFilters'
import './FilterTabs.css'

// 상태 필터 탭. 가로 스크롤되며 360px 에서도 찌그러지지 않는다.
export default function FilterTabs({ active, onChange }) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="상태 필터">
      {LIST_FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          role="tab"
          className="filter-tab"
          data-active={f.id === active}
          aria-selected={f.id === active}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
