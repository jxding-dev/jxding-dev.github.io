import Icon from './Icon'
import './QuickAddButton.css'

// 프레임 오른쪽 아래에 고정되는 기한 추가 버튼. 홈/목록에서 공용.
export default function QuickAddButton({ onClick }) {
  return (
    <button
      type="button"
      className="quick-add"
      onClick={onClick}
      aria-label="기한 빠르게 추가"
    >
      <span className="quick-add__icon" aria-hidden="true">
        <Icon name="plus" size={24} />
      </span>
      <span className="quick-add__label">기한 추가</span>
    </button>
  )
}
