import Icon from './Icon'
import './AppHeader.css'

export default function AppHeader({ onOpenSettings }) {
  return (
    <header className="app-header">
      <div className="app-header__titles">
        <h1 className="app-header__name">
          <span className="app-header__logo" aria-hidden="true">
            <Icon name="logo" size={20} />
          </span>
          까먹지말자
        </h1>
        <p className="app-header__tagline">놓치기 전에 꺼내보기</p>
      </div>
      <span className="app-header__bell" aria-hidden="true">
        <Icon name="bell" size={18} />
      </span>
      {onOpenSettings && (
        <button
          type="button"
          className="app-header__settings"
          onClick={onOpenSettings}
          aria-label="설정"
        >
          <Icon name="settings" size={19} />
        </button>
      )}
    </header>
  )
}
