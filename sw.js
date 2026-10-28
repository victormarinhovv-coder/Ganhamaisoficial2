const V='ganha-mais-v76';
const BASE=['./','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return; // Firebase e outros: direto da rede
  e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c));}return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('./'))));
});

self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.length?l[0].focus():clients.openWindow('./')));});

// ===== PUSH: mostra a notificação na barra do celular, mesmo com o app fechado =====
self.addEventListener('push',e=>{
  let d={};
  try{const j=e.data?e.data.json():{};d=j.data||j.notification||j;}
  catch(_){try{d={texto:e.data.text()};}catch(__){}}
  const titulo=d.titulo||d.title||'Ganha Mais';
  const texto=d.texto||d.body||'';
  if(!texto)return;
  e.waitUntil(self.registration.showNotification(titulo,{body:texto,badge:'badge-96.png',tag:d.avisoId||undefined,timestamp:Number(d.ts)||Date.now(),vibrate:[200,100,200]}));
});
