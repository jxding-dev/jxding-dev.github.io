import AppHeader from './AppHeader'
import TabBar from './TabBar'
import './AppLayout.css'

// 헤더 / 본문 / 하단 탭바로 구성된 모바일 앱 프레임.
// 480px 이상에서는 중앙 정렬된 고정 너비 프레임으로 보인다.
export default function AppLayout({
  activeTab,
  onTabChange,
  onOpenSettings,
  children,
}) {
  return (
    <div className="app-frame">
      <AppHeader onOpenSettings={onOpenSettings} />
      <main className="app-body">{children}</main>
      <TabBar active={activeTab} onChange={onTabChange} />
    </div>
  )
}
