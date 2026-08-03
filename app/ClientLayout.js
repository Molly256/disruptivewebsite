'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ClientLayout({ children }) {
  const pathname = usePathname()

  // PAGES WITH MOBILE APP SHELL
  const appRoutes = [
    '/dashboard',
    '/profile',
    '/viplevels',
    '/deposit',
    '/withdraw',
    '/certificate',
    '/event',
    '/about',
    '/terms',
    '/faqs',
    '/admin'
  ]

  const isAppPage = appRoutes.some(route => pathname?.startsWith(route))

  useEffect(() => {
    if (isAppPage) {
      document.body.setAttribute('data-app-page', 'true')
    } else {
      document.body.removeAttribute('data-app-page')
    }
  }, [isAppPage])

  // FIX: full width on desktop, centered card on mobile
  return isAppPage? (
    <div className="w-full min-h-screen bg-[#0b0b0b] flex justify-center">
      <div className="w-full max-w-[480px] md:max-w-full md:w-full">
        {children}
      </div>
    </div>
  ) : <>{children}</>
}