'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { vip1Set1 } from '@/data/vip1Set1'
import { vip1Set2 } from '@/data/vip1Set2' // ADD THIS

export default function RecordsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('All') // All, Pending, Completed
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if(!saved) { router.push('/login'); return }
    const u = JSON.parse(saved)
    setUser(u)

    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?userId=${u.id}`)
        const data = await res.json()
        if(res.ok) setTasks(data.tasks || [])
      } catch(e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [router])

  const handleSubmitTask = async (taskId) => {
    const res = await fetch('/api/submit-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, taskId })
    })
    const data = await res.json()
    if(res.ok) {
      setTasks(prev => prev.map(t => t.id === taskId? {...t, status: 'completed'} : t))
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } else {
      alert(data.error || 'Submit failed')
    }
  }

  // GET REAL PRODUCT DATA BASED ON VIP + SET + PROGRESS
  const getProductData = (task) => {
    if(!user) return null

    let productArray = []
    // Map vip + set to correct data file
    if(user.vipLevel === 1 && task.setNumber === 1) productArray = vip1Set1
    if(user.vipLevel === 1 && task.setNumber === 2) productArray = vip1Set2 // ADDED
    // add vip2 later

    const progressNum = parseInt(task.progress.split('/')[0]) // "3/40" -> 3
    const product = productArray[progressNum - 1] // arrays start at 0

    if(!product) return null

    return {
     ...product,
      image: `/vip${task.vipLevel}/set${task.setNumber}/photo${product.id}.jpg`, // FIX: use task.vipLevel
      progressDisplay: `[${progressNum}]`
    }
  }

  const filteredTasks = tasks.filter(task => {
    if(activeTab === 'All') return true
    if(activeTab === 'Pending') return task.status === 'pending'
    if(activeTab === 'Completed') return task.status === 'completed'
    return true
  })

  const tabs = ['All', 'Pending', 'Completed']

  // USA TIME - America/New_York
  const formatDate = (date) => new Date(date).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  })

  if(loading) return null

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>
      <AppHeader />

      {/* HEADER */}
      <div style={{ background: '#FFF', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <button onClick={() => router.back()} style={{ position: 'absolute', left: 16, background: 'none', border: 'none', fontSize: 24 }}>‹</button>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#000', margin: 0 }}>Records</h1>
      </div>

      {/* 3 TABS - Hot Red bg with Black text */}
      <div style={{ background: '#FFF', display: 'flex', gap: '8px', padding: '16px' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '10px 0',
              background: activeTab === tab? '#FF0000' : '#E0E0E0',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              color: activeTab === tab? '#000' : '#666',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TASK CARDS */}
      <div style={{ padding: '0 16px 16px' }}>
        {filteredTasks.length === 0? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: '14px' }}>
            No {activeTab.toLowerCase()} records
          </div>
        ) : (
          filteredTasks.map(task => {
            const product = getProductData(task)
            if(!product) return null
            const profit = task.totalProfit || (product.price * 0.005) // FIX: use real profit from DB

            return (
              <div key={task.id} style={{ background: '#FFF', borderRadius: '12px', padding: '16px', marginBottom: '12px', position: 'relative' }}>

                {/* COMPLETED BADGE TOP RIGHT - Red button with Black text */}
                {task.status === 'completed' && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: '#FF0000',
                    color: '#000'
                  }}>
                    Completed
                  </div>
                )}

                {/* Row 1: Date + Pending Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingRight: task.status === 'completed'? '90px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: '#000' }}>
                    <span>📅</span> {formatDate(task.createdAt)}
                  </div>
                  {task.status === 'pending' && (
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      background: '#FF0000',
                      color: '#000'
                    }}>
                      Pending
                    </div>
                  )}
                </div>

                {/* Row 2: Product Image + Details FROM REAL DATA */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#F5F5F5', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>
                      {product.progressDisplay} {product.name}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>
                      {product.price.toFixed(2)} x1 USD
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Code: {task.taskCode}</div> {/* ADDED */}
                  </div>
                </div>

                {/* Row 3: Total + Profit + Submit Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Total Amount</div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#000' }}>{task.totalPrice.toFixed(2)} <span style={{fontSize:12}}>USD</span></div> {/* FIX: use task.totalPrice */}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Profit</div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#000' }}>{profit.toFixed(2)} <span style={{fontSize:12}}>USD</span></div>
                    </div>
                  </div>

                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleSubmitTask(task.id)}
                      style={{
                        background: '#FF0000',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Submit
                    </button>
                  )}
                </div>

              </div>
            )
          })
        )}
      </div>

      <BottomNav />
    </div>
  )
}