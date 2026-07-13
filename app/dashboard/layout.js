import DashboardHeader from '../../components/DashboardHeader' // Imports it out of the components folder

export default function DashboardLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* Puts the header at the top of the dashboard section */}
      <DashboardHeader />
      
      {/* Pushes your page content down 64px so the header doesn't cover it */}
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
    </div>
  )
}