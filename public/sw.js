self.addEventListener('push', e=>{
  const d = e.data ? e.data.json() : {}
  e.waitUntil(
    self.registration.showNotification(d.title||'New Message 🔔', {
      body: d.body||'You have new chat message from user',
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [300,100,300,100,300],
      requireInteraction: true,
      tag: 'chat-new',
      renotify: true,
      data: { url: '/admin' }
    })
  )
})

self.addEventListener('notificationclick', e=>{
  e.notification.close()
  e.waitUntil(
    clients.matchAll({type:'window'}).then(list=>{
      for(let c of list){ if(c.url.includes(self.location.origin) && 'focus' in c) return c.focus() }
      if(clients.openWindow) return clients.openWindow('/admin')
    })
  )
})