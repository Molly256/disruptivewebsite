'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'

export default function RecordsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('All')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState(null) 

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if(!saved) return router.push('/login')
    const u = JSON.parse(saved)
    setUser(u)
    fetch(`/api/tasks?userId=${u.id}`).then(r => r.json()).then(d => { setTasks(d.tasks || []); setLoading(false) })
  }, [router])

  const handleSubmitTask = async (task) => {
    if(submittingId) return 
    setSubmittingId(task.id)

    // 💡 FIXED: Safely extract numeric currentTaskNumber from task.progress (e.g., "D1 S1 T5/40" -> 5)
    let extractedTaskNumber = 1
    if (task.progress && task.progress.includes('T')) {
      const match = task.progress.match(/T(\d+)/)
      if (match) extractedTaskNumber = Number(match[1])
    } else {
      const productsList = typeof task.products === 'string' ? JSON.parse(task.products) : (task.products || [])
      if (productsList.length > 0) extractedTaskNumber = Number(productsList[0].id || 1)
    }

    // 💡 FIXED: Now sends the precise currentTaskNumber parameter expected by your backend route!
    const res = await fetch('/api/submit-task', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ userId: user.id, currentTaskNumber: extractedTaskNumber }) 
    })
    
    const data = await res.json()
    setSubmittingId(null)
    
    if(res.ok) {
      setTasks(p => p.map(t => t.id === task.id ? {...t, status: 'completed'} : t))
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } else {
      alert(data.error || 'Submit failed')
    }
  }

  const filteredTasks = tasks.filter(t => activeTab === 'All' || t.status.toLowerCase() === activeTab.toLowerCase())

  if(loading || !user) return null 

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>
      <AppHeader />
      <div style={{ background: '#FFF', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <button onClick={() => router.back()} style={{ position: 'absolute', left: 16, background: 'none', border: 'none', fontSize: 24 }}>‹</button>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#000', margin: 0 }}>Records</h1>
      </div>
      <div style={{ background: '#FFF', display: 'flex', gap: '8px', padding: '16px' }}>
        {['All', 'Pending', 'Completed'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '10px 0', background: activeTab === tab? '#FF0000' : '#E0E0E0', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', color: activeTab === tab? '#FFF' : '#666', cursor: 'pointer' }}>{t(tab)}</button>
        ))}
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        {filteredTasks.length === 0? <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: '14px' }}>No records found</div> : filteredTasks.map(task => {
          const productsList = typeof task.products === 'string'? JSON.parse(task.products) : (task.products || [])

          const fullyFormed = productsList.map(item => {
            const day = task.day || 1
            const set = task.setNumber || 1
            const vip = task.vipLevel || user.vipLevel || 1 
            const pid = item.productId || item.id || item.photoId || 0 
            return {
              id: pid,
              name: item.name || `Product Item #${pid}`,
              price: Number(item.price || 0),
              profit: Number(item.profit || 0),
              image: item.image || `/vip${vip}/day${day}/set${set}/photo${pid}.jpg`, 
              bonus: Number(item.bonusMultiplier) || 1
            }
          })

          const totalCost = fullyFormed.reduce((s, p) => s + p.price, 0)
          const totalProfit = fullyFormed.reduce((s, p) => s + p.profit, 0)

          return (
            <div key={task.id} style={{ background: '#FFF', borderRadius: '12px', padding: '16px', marginBottom: '12px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingRight: task.status === 'completed'? '90px' : '0' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>D{task.day || 1} S{task.setNumber || 1} • {new Date(task.createdAt).toLocaleString('en-US', { timeZone: 'America/New_York', month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                <div style={{ position: task.status === 'completed'? 'absolute' : 'static', top: '16px', right: '16px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', background: task.status === 'completed'? '#00C853' : '#FF0000', color: '#000' }}>{t(task.status === 'completed'? 'Completed' : 'Pending')}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                {fullyFormed.map((prod, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                    <img src={prod.image} alt="" onError={(e)=>{e.target.src='/placeholder.jpg'}} style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#F5F5F5', borderRadius: '8px' }} /> 
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>[{prod.id}] {prod.name} {prod.bonus > 1? `x${prod.bonus}` : ''}</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>{prod.price.toFixed(2)} x1 USD</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Code: {task.taskCode}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div><div style={{ fontSize: '12px', color: '#666' }}>Total Amount</div><div style={{ fontSize: '15px', fontWeight: '800', color: '#000' }}>{totalCost.toFixed(2)} <span style={{ fontSize: 12 }}>USD</span></div></div>
                  <div><div style={{ fontSize: '12px', color: '#666' }}>Profit</div><div style={{ fontSize: '15px', fontWeight: '800', color: '#FF0000' }}>{totalProfit.toFixed(2)} <span style={{ fontSize: 12 }}>USD</span></div></div>
                </div>
                {/* 💡 FIXED: Pass the whole task object inside your click payload */}
                {task.status === 'pending' && <button disabled={submittingId === task.id} onClick={() => handleSubmitTask(task)} style={{ background: submittingId === task.id? '#CCC' : '#FF0000', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: submittingId === task.id? 'not-allowed' : 'pointer' }}>{submittingId === task.id? 'Submitting...' : 'Submit'}</button>}
              </div>
            </div>
          )
        })}
      </div>
      <BottomNav />
    </div>
  )
}
