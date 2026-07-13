import DashboardHeader from './DashboardHeader'

export default function DashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <main style={{ paddingTop: '84px' }}>
        {children}
      </main>
    </>
  )
}