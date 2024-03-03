import { HttpClient } from './interfaces/HttpClient'
import { Player } from './interfaces/Player'
import { Vehicle } from './interfaces/Vehicle'

let players: Player[] = []
let clients: HttpClient[] = []

const mapPassword = GetConvar('map_password', 'TEEEEST')
const baseUrl = GetConvar('web_baseUrl', '')
const isProtected = mapPassword !== ''

const headers = {
    'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Origin': 'https://fivem-map.netlify.app', to replace in prod
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
}

if (baseUrl !== '') {
    const mapUrl = `https://fivem-map.netlify.app/${btoa(baseUrl)}`
    console.log(`The live map can be accessed here: ${mapUrl}`)
}

SetHttpHandler((req: any, res: any) => {
    if (req.path == '/data') {
        if (isProtected) {
            console.log('yolo')
            req.setDataHandler((data: string) => {
                const payload = JSON.parse(data)
                console.log(payload.password)
                console.log(mapPassword)
                if (!payload.password) {
                    console.log('no password')
                    res.writeHead(403, headers)
                    res.send()
                } else if (payload.password !== mapPassword) {
                    console.log('wrong password')
                    res.writeHead(422, headers)
                    res.send()
                }
            })
        }
        res.writeHead(200, headers)
        const clientId = Date.now()
        clients.push({
            id: clientId,
            res,
        })
        req.setCancelHandler(() => {
            console.log(`${clientId} Connection closed`)
            clients = clients.filter((client: any) => client.id !== clientId)
        })
        const data = `data: ${JSON.stringify(players)}\n\n`
        res.write(data)
    }
})

const sendDataToAllClients = (players: Player[]) => {
    clients.forEach((client: any) =>
        client.res.write(`data: ${JSON.stringify(players)}\n\n`)
    )
}

on('map:update', (playerIds: string[]) => {
    players = []
    playerIds.forEach((playerId) => {
        const ped = GetPlayerPed(playerId)
        const name = GetPlayerName(playerId)
        const [playerX, playerY] = GetEntityCoords(ped)
        const vehicle = GetVehiclePedIsIn(ped, false)
        const vehicleType = GetVehicleType(vehicle) as Vehicle
        players.push({ x: playerX, y: playerY, name, vehicle: vehicleType })
    })
    sendDataToAllClients(players)
})
