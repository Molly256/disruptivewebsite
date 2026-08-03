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

  // Dynamically toggles layout state flags on the DOM body root element
  useEffect(() => {
    if (isAppPage) {
      document.body.setAttribute('data-app-page', 'true')
    } else {
      document.body.removeAttribute('data-app-page')
    }
  }, [isAppPage])

  // Returns a simple semantic wrapper node so styles target it flawlessly
  return isAppPage ? <div class="app-shell-main">{children}</div> : <>{children}</>
}
