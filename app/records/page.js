'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'
import { vip1Set1 } from '@/data/vip1Set1'
import { vip1Set2 } from '@/data/vip1Set2'

export default function RecordsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('All')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if(!saved) return router.push('/login')
    const u = JSON.parse(saved)
    setUser(u)
    fetch(`/api/tasks?userId=${u.id}`).then(r => r.json()).then(d => { setTasks(d.tasks || []); setLoading(false) })
  }, [router])

  const handleSubmitTask = async (taskId) => {
    const res = await fetch('/api/submit-task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, taskId }) })
    const data = await res.json()
    if(res.ok) {
      setTasks(p => p.map(t => t.id === taskId ? {...t, status: 'completed'} : t))
      setUser(data.user); localStorage.setItem('user', JSON.stringify(data.user))
    } else alert(data.error || 'Submit failed')
  }

  const getStaticProduct = (id, setNum) => {
    const set = setNum === 2 ? vip1Set2 : vip1Set1
    return set.find(p => Number(p.id) === Number(id)) || null
  }

  const filteredTasks = tasks.filter(t => activeTab === 'All' || t.status.toLowerCase() === activeTab.toLowerCase())

  if(loading) return null

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>
      <AppHeader /><div style={{ background: '#FFF', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}><button onClick={() => router.back()} style={{ position: 'absolute', left: 16, background: 'none', border: 'none', fontSize: 24 }}>‹</button><h1 style={{ fontSize: '20px', fontWeight: '800', color: '#000', margin: 0 }}>Records</h1></div>
      <div style={{ background: '#FFF', display: 'flex', gap: '8px', padding: '16px' }}>
        {['All', 'Pending', 'Completed'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '10px 0', background: activeTab === tab ? '#FF0000' : '#E0E0E0', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', color: activeTab === tab ? '#000' : '#666', cursor: 'pointer' }}>{t(tab)}</button>
        ))}
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        {filteredTasks.length === 0 ? <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: '14px' }}>No records found</div> : filteredTasks.map(task => {
          const productsList = typeof task.products === 'string' ? JSON.parse(task.products) : (task.products || [])
          const fullyFormed = productsList.map(item => {
            const staticInfo = getStaticProduct(item.productId || item.id, task.setNumber)
            return {
              id: item.productId || item.id,
              name: item.name || staticInfo?.name || `Product Item #${item.productId}`,
              price: Number(item.price || staticInfo?.price || 0),
              profit: Number(item.profit || 0),
              image: `/vip${task.vipLevel}/set${task.setNumber}/photo${item.productId || item.id}.jpg`
            }
          })
          const totalCost = fullyFormed.reduce((s, p) => s + p.price, 0)
          const totalProfit = fullyFormed.reduce((s, p) => s + p.profit, 0)

          return (
            <div key={task.id} style={{ background: '#FFF', borderRadius: '12px', padding: '16px', marginBottom: '12px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingRight: task.status === 'completed' ? '90px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: '#000' }}><span>📅</span> {new Date(task.createdAt).toLocaleString('en-US', { timeZone: 'America/New_York', month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                <div style={{ position: task.status === 'completed' ? 'absolute' : 'static', top: '16px', right: '16px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', background: '#FF0000', color: '#000' }}>{t(task.status === 'completed' ? 'Completed' : 'Pending')}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                {fullyFormed.map((prod, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                    <img src={prod.image} alt="" style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#F5F5F5', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}><div style={{ fontSize: '14px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>[{prod.id}] {prod.name}</div><div style={{ fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>{prod.price.toFixed(2)} x1 USD</div><div style={{ fontSize: '12px', color: '#666' }}>Code: {task.taskCode}</div></div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div><div style={{ fontSize: '12px', color: '#666' }}>Total Amount</div><div style={{ fontSize: '15px', fontWeight: '800', color: '#000' }}>{totalCost.toFixed(2)} <span style={{ fontSize: 12 }}>USD</span></div></div>
                  <div><div style={{ fontSize: '12px', color: '#666' }}>Profit</div><div style={{ fontSize: '15px', fontWeight: '800', color: '#000' }}>{totalProfit.toFixed(2)} <span style={{ fontSize: 12 }}>USD</span></div></div>
                </div>
                {task.status === 'pending' && <button onClick={() => handleSubmitTask(task.id)} style={{ background: '#FF0000', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Submit</button>}
              </div>
            </div>
          )
        })}
      </div>
      <BottomNav />
    </div>
  )
}
