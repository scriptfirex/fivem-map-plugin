(function(t){typeof define=="function"&&define.amd?define(t):t()})(function(){"use strict";let t=[],l=[];const c=GetConvar("map_password","TEEEEST"),r=GetConvar("web_baseUrl",""),p=c!=="",i={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Content-Type":"text/event-stream",Connection:"keep-alive","Cache-Control":"no-cache"};if(r!==""){const o=`https://fivem-map.netlify.app/${btoa(r)}`;console.log(`The live map can be accessed here: ${o}`)}SetHttpHandler((o,e)=>{if(o.path=="/data"){p&&(console.log("yolo"),o.setDataHandler(s=>{const a=JSON.parse(s);console.log(a.password),console.log(c),a.password?a.password!==c&&(console.log("wrong password"),e.writeHead(422,i),e.send()):(console.log("no password"),e.writeHead(403,i),e.send())})),e.writeHead(200,i);const n=Date.now();l.push({id:n,res:e}),o.setCancelHandler(()=>{console.log(`${n} Connection closed`),l=l.filter(s=>s.id!==n)});const d=`data: ${JSON.stringify(t)}

`;e.write(d)}});const f=o=>{l.forEach(e=>e.res.write(`data: ${JSON.stringify(o)}

`))};on("map:update",o=>{t=[],o.forEach(e=>{const n=GetPlayerPed(e),d=GetPlayerName(e),[s,a]=GetEntityCoords(n),w=GetVehiclePedIsIn(n,!1),h=GetVehicleType(w);t.push({x:s,y:a,name:d,vehicle:h})}),f(t)})});
