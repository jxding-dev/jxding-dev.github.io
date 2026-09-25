import { useEffect, useState } from 'react'
import AppLayout from './components/AppLayout'
import LaunchScreen from './components/LaunchScreen'
import HomePage from './pages/HomePage'
import ListPage from './pages/ListPage'
import AddPage from './pages/AddPage'
import DetailPage from './pages/DetailPage'
import EditPage from './pages/EditPage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'
import { DEFAULT_TAB } from './data/tabs'
import { useDeadlines } from './hooks/useDeadlines'
import { useCategories } from './hooks/useCategories'
import { buildBackup, parseBackup } from './utils/backup'
import { toISODateString } from './utils/dateUtils'

export default function App() {
  const [isLaunching, setIsLaunching] = useState(true)
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB)
  // 오버레이 라우팅: { type: 'tabs' | 'add' | 'detail' | 'edit' | 'settings', id? }
  const [screen, setScreen] = useState({ type: 'tabs' })

  const {
    deadlines,
    addDeadline,
    updateDeadline,
    completeDeadline,
    postponeDeadline,
    holdDeadline,
    restoreDeadline,
    reassignCategory,
    importDeadlines,
    resetDeadlines,
    clearDeadlines,
    deleteDeadline,
  } = useDeadlines()

  const {
    categories,
    customCategories,
    addCategory,
    removeCategory,
    replaceCustomCategories,
  } = useCategories()

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLaunching(false), 1500)
    return () => window.clearTimeout(timer)
  }, [])

  const goTabs = () => setScreen({ type: 'tabs' })
  const openDetail = (item) => setScreen({ type: 'detail', id: item.id })
  const openEdit = (id) => setScreen({ type: 'edit', id })

  const handleSave = (values) => {
    addDeadline(values)
    setActiveTab('all')
    goTabs()
  }

  // 카테고리 삭제 시 해당 기한을 '기타'로 옮기고 카테고리 제거.
  const handleRemoveCategory = (id) => {
    reassignCategory(id, 'etc')
    removeCategory(id)
  }

  // 백업 내보내기 — Blob 다운로드.
  const handleExport = () => {
    const json = JSON.stringify(buildBackup(deadlines, customCategories), null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `까먹기전에-백업-${toISODateString(new Date())}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 백업 불러오기 — 검증 후 적용. 잘못된 파일이면 메시지만 반환.
  const handleImportFile = async (file) => {
    let text
    try {
      text = await file.text()
    } catch {
      return { ok: false, error: '파일을 읽을 수 없어요.' }
    }
    const res = parseBackup(text)
    if (!res.ok) return res
    importDeadlines(res.data.deadlines)
    replaceCustomCategories(res.data.categories)
    return { ok: true, count: res.data.deadlines.length }
  }

  const launchOverlay = isLaunching ? <LaunchScreen /> : null

  // 등록
  if (screen.type === 'add') {
    return (
      <>
        <AddPage onSave={handleSave} onCancel={goTabs} categories={categories} />
        {launchOverlay}
      </>
    )
  }

  // 수정
  if (screen.type === 'edit') {
    const item = deadlines.find((d) => d.id === screen.id)
    return (
      <>
        <EditPage
          item={item}
          categories={categories}
          onSave={(values) => {
            updateDeadline(screen.id, values)
            setScreen({ type: 'detail', id: screen.id })
          }}
          onCancel={() => setScreen({ type: 'detail', id: screen.id })}
        />
        {launchOverlay}
      </>
    )
  }

  // 상세
  if (screen.type === 'detail') {
    const item = deadlines.find((d) => d.id === screen.id)
    return (
      <>
        <DetailPage
          item={item}
          onBack={goTabs}
          onEdit={() => openEdit(screen.id)}
          onComplete={() => completeDeadline(screen.id)}
          onPostpone={(newDueDate) => postponeDeadline(screen.id, newDueDate)}
          onHold={() => holdDeadline(screen.id)}
          onRestore={() => restoreDeadline(screen.id)}
          onDelete={() => {
            deleteDeadline(screen.id)
            goTabs()
          }}
        />
        {launchOverlay}
      </>
    )
  }

  // 설정
  if (screen.type === 'settings') {
    return (
      <>
        <SettingsPage
          categories={categories}
          onAddCategory={addCategory}
          onRemoveCategory={handleRemoveCategory}
          onExport={handleExport}
          onImportFile={handleImportFile}
          onReset={resetDeadlines}
          onClear={clearDeadlines}
          onBack={goTabs}
        />
        {launchOverlay}
      </>
    )
  }

  return (
    <>
      <AppLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setScreen({ type: 'settings' })}
      >
        {activeTab === 'today' && (
          <HomePage
            deadlines={deadlines}
            onOpenItem={openDetail}
            onQuickAdd={() => setScreen({ type: 'add' })}
            onViewAll={() => setActiveTab('all')}
          />
        )}
        {activeTab === 'stats' && (
          <StatsPage
            deadlines={deadlines}
            categories={categories}
            onOpenItem={openDetail}
          />
        )}
        {activeTab !== 'today' && activeTab !== 'stats' && (
          <ListPage
            key={activeTab}
            deadlines={deadlines}
            initialFilter={activeTab}
            categories={categories}
            onOpenItem={openDetail}
            onQuickAdd={() => setScreen({ type: 'add' })}
          />
        )}
      </AppLayout>
      {launchOverlay}
    </>
  )
}
