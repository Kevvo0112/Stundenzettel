var CACHE="stundenzettel-v1";
var CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
var EXTRA="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js";
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return c.addAll(CORE).then(function(){
      return fetch(new Request(EXTRA,{mode:"no-cors"})).then(function(r){return c.put(EXTRA,r)}).catch(function(){});
    });
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(hit){
    var net=fetch(e.request).then(function(r){
      if(r&&(r.ok||r.type==="opaque")){var copy=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy)})}
      return r;
    }).catch(function(){return hit});
    return hit||net;
  }));
});
