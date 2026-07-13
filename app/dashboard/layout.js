import DashboardHeader from './Dashboardheader' // Changed to match your file name exactly

export default function DashboardLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <DashboardHeader />
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
    </div>
  )
}