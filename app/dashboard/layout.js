import DashboardHeader from './DashboardHeader'

export default function DashboardLayout({ children }) {
  console.log('DASHBOARD LAYOUT LOADED') 
  return (
    <>
      <DashboardHeader />
      <main style={{ paddingTop: '84px' }}>
        {children}
      </main>
    </>
  )
}