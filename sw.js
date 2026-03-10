const CACHE_NAME = 'pos-chaisiri-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png'
  // ถ้ามีรูปอื่น หรือไฟล์ css อื่นที่อัปโหลดไว้ใน Github ให้เอาชื่อไฟล์มาใส่เพิ่มตรงนี้ครับ
];

// จังหวะติดตั้ง Service Worker (โหลดไฟล์เก็บลง Cache เครื่องมือถือ)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// จังหวะเรียกใช้ไฟล์ (ดึงจาก Cache ก่อน ถ้าไม่มีค่อยไปโหลดจากเน็ต)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ถ้าเจอไฟล์ใน Cache ให้ส่งคืนทันที (เร็วมาก)
        if (response) {
          return response;
        }
        // ถ้าไม่เจอ ให้ไปโหลดจาก Network ปกติ
        return fetch(event.request);
      })
  );
});

// จังหวะอัปเดตเวอร์ชันใหม่ (ล้าง Cache เก่าทิ้งเมื่อมีการเปลี่ยน CACHE_NAME)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
