import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import useAppStore from '@/stores/main'

export default function Layout() {
  const { uiScale, visionMode } = useAppStore()

  useEffect(() => {
    document.documentElement.style.fontSize = `${uiScale * 100}%`
    document.documentElement.classList.remove(
      'vision-protanopia',
      'vision-deuteranopia',
      'vision-tritanopia',
    )
    if (visionMode !== 'default') {
      document.documentElement.classList.add(`vision-${visionMode}`)
    }
  }, [uiScale, visionMode])

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <div className="hidden md:block w-64 fixed h-screen top-0 left-0 z-50">
        <Sidebar />
      </div>
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-16 md:pb-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
        <MobileNav />
      </div>
    </div>
  )
}
