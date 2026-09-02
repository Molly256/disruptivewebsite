self.addEventListener('push', e=>{
  let d = {}
  try { d = e.data ? e.data.json() : {} } catch { d = { body: e.data?.text() } }
  
  const unread = d.unread || d.count || 1
  const title = d.title || `💬 ${d.name || 'New Message'} ${unread>1?`(${unread})`:''}`

  // app icon badge count for PWA
  if ('setAppBadge' in self.navigator) {
    self.navigator.setAppBadge(unread).catch(()=>{})
  }

  e.waitUntil(
    self.registration.showNotification(title, {
      body: d.body || d.lastMessage || 'You have new chat message from user',
      icon: '/logo-512.png',
      badge: '/logo-512.png',
      image: '/logo-912.png',
      vibrate: [400,150,400,150,600],
      requireInteraction: true,
      tag: 'admin-chat-unread',
      renotify: true,
      data: { url: d.url || '/admin', count: unread }
    })
  )
})

self.addEventListener('notificationclick', e=>{
  e.notification.close()
  if ('clearAppBadge' in self.navigator) {
    self.navigator.clearAppBadge().catch(()=>{})
  }
  e.waitUntil(
    clients.matchAll({type:'window'}).then(list=>{
      for(let c of list){ 
        if(c.url.includes('/admin') && 'focus' in c) {
          c.navigate('/admin')
          return c.focus() 
        }
      }
      if(clients.openWindow) return clients.openWindow('/admin')
    })
  )
})