if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,c)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let f={};const t=e=>n(e,r),o={module:{uri:r},exports:f,require:t};i[r]=Promise.all(s.map((e=>o[e]||t(e)))).then((e=>(c(...e),f)))}}define(["./workbox-7369c0e1"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-c82dfcf4.css",revision:null},{url:"assets/index-e5c81d11.js",revision:null},{url:"index.html",revision:"cb665cc13e509624d3037985af0d09ef"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"manifest/icon-192x192.png",revision:"bd6000fa2603f598f48b94ac8d7c8cb7"},{url:"manifest/icon-256x256.png",revision:"f7ef82c576f7ffc235ebb8de80c3a6ee"},{url:"manifest/icon-384x384.png",revision:"fd0c64e3b1ef18da81bd76f6125e9519"},{url:"manifest/icon-512x512.png",revision:"ea297e61c0e70ab7ae8f22fdf8bb188e"},{url:"manifest.webmanifest",revision:"92d88c420c6dfaf666c03b6ec3cd3524"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
