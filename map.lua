function getPlayerIDs()
    local ids = {}
    for _, playerId in ipairs(GetPlayers()) do
        table.insert(ids, playerId)
    end
    return ids
end

Citizen.CreateThread(function()
    while true do
      TriggerEvent("map:update", getPlayerIDs())
      Citizen.Wait(1000)
    end
end)
