let n = [], l = [];
const i = GetConvar("map_password", "TEEEEST"), d = GetConvar("web_baseUrl", ""), h = i !== "", r = {
  "Access-Control-Allow-Origin": "*",
  // 'Access-Control-Allow-Origin': 'https://fivem-map.netlify.app', to replace in prod
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "text/event-stream",
  Connection: "keep-alive",
  "Cache-Control": "no-cache"
};
if (d !== "") {
  const o = `https://fivem-map.netlify.app/${btoa(d)}`;
  console.log(`The live map can be accessed here: ${o}`);
}
SetHttpHandler((o, e) => {
  if (o.path == "/data") {
    h && (console.log("yolo"), o.setDataHandler((a) => {
      const s = JSON.parse(a);
      console.log(s.password), console.log(i), s.password ? s.password !== i && (console.log("wrong password"), e.writeHead(422, r), e.send()) : (console.log("no password"), e.writeHead(403, r), e.send());
    })), e.writeHead(200, r);
    const t = Date.now();
    l.push({
      id: t,
      res: e
    }), o.setCancelHandler(() => {
      console.log(`${t} Connection closed`), l = l.filter((a) => a.id !== t);
    });
    const c = `data: ${JSON.stringify(n)}

`;
    e.write(c);
  }
});
const y = (o) => {
  l.forEach(
    (e) => e.res.write(`data: ${JSON.stringify(o)}

`)
  );
};
on("map:update", (o) => {
  n = [], o.forEach((e) => {
    const t = GetPlayerPed(e), c = GetPlayerName(e), [a, s] = GetEntityCoords(t), p = GetVehiclePedIsIn(t, !1), w = GetVehicleType(p);
    n.push({ x: a, y: s, name: c, vehicle: w });
  }), y(n);
});
