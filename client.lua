local resourceName = GetCurrentResourceName()
local shutdownSent = false

local function shutdownLoadingScreen()
    if shutdownSent then return end
    shutdownSent = true

    -- This callback is invoked by the NUI only after its exit transition.
    ShutdownLoadingScreenNui()
end

-- Manual shutdown is enabled in fxmanifest.lua. The NUI decides when to exit
-- after receiving FiveM's real load progress data.
RegisterNUICallback('shutdown', function(_, cb)
    cb({ ok = true })
    Citizen.SetTimeout(50, shutdownLoadingScreen)
end)

AddEventHandler('onClientResourceStop', function(stoppedResource)
    if stoppedResource == resourceName then
        ShutdownLoadingScreenNui()
    end
end)
