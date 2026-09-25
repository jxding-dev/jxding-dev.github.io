import { getAllCategories } from '../data/defaultCategories'
import Icon from './Icon'
import { getCategoryIconName } from './iconNames'
import './CategoryChips.css'

// '전체' + 카테고리 칩. 가로 스크롤. active 는 카테고리 id 또는 'all'.
export default function CategoryChips({
  active,
  onChange,
  categories = getAllCategories(),
}) {
  const chips = [{ id: 'all', label: '전체' }, ...categories]
  return (
    <div className="category-chips" aria-label="카테고리 필터">
      {chips.map((c) => (
        <button
          key={c.id}
          type="button"
          className="category-chip"
          data-active={c.id === active}
          aria-pressed={c.id === active}
          onClick={() => onChange(c.id)}
        >
          <Icon name={getCategoryIconName(c.id)} size={18} />
          {c.label}
        </button>
      ))}
    </div>
  )
}
