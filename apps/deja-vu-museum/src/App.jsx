import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomCursor from './components/CustomCursor'
import Intro from './components/Intro'
import Corridor from './components/Corridor'
import DreamStorage from './components/DreamStorage'
import ImageHall from './components/ImageHall'
import TextDrawer from './components/TextDrawer'
import RestrictedRoom from './components/RestrictedRoom'
import ExhibitPage from './components/ExhibitPage'
import AdminPage from './components/AdminPage'
import {
  dreams as defaultDreams,
  images as defaultImages,
  notes as defaultNotes,
  roomSigns as defaultRooms,
} from './data/exhibits'

gsap.registerPlugin(ScrollTrigger)

const STORAGE_KEY = 'deja-vu-museum-admin-data'

const defaultMuseumData = {
  rooms: defaultRooms,
  dreams: defaultDreams,
  images: defaultImages,
  notes: defaultNotes,
}

const navItems = [
  { id: 'entrance', label: '입구' },
  { id: 'corridor', label: '복도' },
  { id: 'dream-storage', label: '꿈 보관소' },
  { id: 'image-hall', label: '이미지 회랑' },
  { id: 'text-drawer', label: '문장 서랍' },
  { id: 'restricted-room', label: '제한 구역' },
  { id: 'ending', label: '퇴장' },
]

const loadMuseumData = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultMuseumData
    const parsed = JSON.parse(saved)
    return {
      rooms: Array.isArray(parsed.rooms) ? parsed.rooms : defaultRooms,
      dreams: Array.isArray(parsed.dreams) ? parsed.dreams : defaultDreams,
      images: Array.isArray(parsed.images) ? parsed.images : defaultImages,
      notes: Array.isArray(parsed.notes) ? parsed.notes : defaultNotes,
    }
  } catch {
    return defaultMuseumData
  }
}

function App() {
  const [entered, setEntered] = useState(false)
  const [activeSection, setActiveSection] = useState('entrance')
  const [openRoom, setOpenRoom] = useState(null)
  const [adminOpen, setAdminOpen] = useState(() => window.location.hash === '#admin')
  const [museumData, setMuseumData] = useState(loadMuseumData)
  const mainRef = useRef(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(museumData))
  }, [museumData])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((item) => {
        gsap.fromTo(
          item,
          { y: 42, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 82%' },
          },
        )
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      document.documentElement.style.setProperty('--scroll-progress', `${Math.min(1, Math.max(0, progress))}`)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { threshold: [0.25, 0.45, 0.65], rootMargin: '-18% 0px -34% 0px' },
    )

    navItems.forEach((item) => {
      const section = document.getElementById(item.id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const handleEnter = () => {
    setEntered(true)
    window.setTimeout(() => {
      document.getElementById('corridor')?.scrollIntoView({ behavior: 'smooth' })
    }, 460)
  }

  const goToSection = (id) => {
    const section = document.getElementById(id)
    if (!section) return
    setActiveSection(id)
    const top = section.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpenRoom(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const syncRoomFromHash = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true)
        return
      }

      setAdminOpen(false)
      const slug = window.location.hash.replace('#page-', '')
      const room = museumData.rooms.find((item) => item.slug === slug)
      if (room) setOpenRoom(room)
    }

    syncRoomFromHash()
    window.addEventListener('hashchange', syncRoomFromHash)
    return () => window.removeEventListener('hashchange', syncRoomFromHash)
  }, [museumData.rooms])

  useEffect(() => {
    const openRoomFromClick = (event) => {
      const closeTarget = event.target.closest('[data-close-room]')
      if (closeTarget) {
        event.preventDefault()
        setOpenRoom(null)
        window.history.pushState(null, '', '#corridor')
        return
      }

      const target = event.target.closest('[data-room]')
      if (!target) return
      const room = museumData.rooms.find((item) => item.slug === target.dataset.room)
      if (!room) return
      event.preventDefault()
      setOpenRoom(room)
      window.history.pushState(null, '', `#page-${room.slug}`)
    }

    document.addEventListener('click', openRoomFromClick, true)
    return () => document.removeEventListener('click', openRoomFromClick, true)
  }, [museumData.rooms])

  const closeRoomPage = () => {
    setOpenRoom(null)
    if (window.location.hash.startsWith('#page-')) {
      window.history.pushState(null, '', '#corridor')
    }
  }

  const closeAdmin = () => {
    setAdminOpen(false)
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', '#entrance')
    }
  }

  const resetMuseumData = () => {
    setMuseumData(defaultMuseumData)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <main ref={mainRef} className={entered ? 'site has-entered' : 'site'}>
      <CustomCursor />
      <div className="museum-ui" aria-hidden="true">
        <div className="progress-rail">
          <span />
        </div>
        <div className="status-strip">
          <span>현재 전시</span>
          <strong>{navItems.find((item) => item.id === activeSection)?.label}</strong>
        </div>
      </div>
      <nav className="section-nav" aria-label="전시실 바로가기">
        {navItems.map((item) => (
          <button
            className={activeSection === item.id ? 'is-active' : ''}
            key={item.id}
            type="button"
            onClick={() => goToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <Intro entered={entered} onEnter={handleEnter} />
      <Corridor rooms={museumData.rooms} onOpenRoom={setOpenRoom} />
      <DreamStorage dreams={museumData.dreams} />
      <ImageHall images={museumData.images} />
      <TextDrawer notes={museumData.notes} />
      <RestrictedRoom />
      <section className="ending section-shell" id="ending">
        <p className="section-kicker">퇴장 기록 / 07</p>
        <h2 className="ending-question" data-reveal>
          당신이 본 것은
          <span>기억입니까, 꿈입니까?</span>
        </h2>
        <button className="text-return" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          입구로 돌아가기
        </button>
      </section>
      <ExhibitPage room={openRoom} onClose={closeRoomPage} />
      {adminOpen && (
        <AdminPage data={museumData} onChange={setMuseumData} onClose={closeAdmin} onReset={resetMuseumData} />
      )}
    </main>
  )
}

export default App
