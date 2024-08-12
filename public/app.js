import { ChassisBuilder } from '../class/builder-ui/ChassisBuilder.js'
import { EngineBuilder } from '../class/builder-ui/EngineBuilder.js'
import { TiresBuilder } from '../class/builder-ui/TiresBuilder.js'
import { DoorsBuilder } from '../class/builder-ui/DoorsBuilder.js'
import { WindowsBuilder } from '../class/builder-ui/WindowsBuilder.js'
import { SeatsBuilder } from '../class/builder-ui/SeatsBuilder.js'
import { VehicleBuilder } from '../class/builder-ui/VehicleBuilder.js'
import { VehicleEditor } from '../class/editor-ui/VehicleEditor.js'

let chassisBuilder
let engineBuilder
let tiresBuilder
let doorsBuilder
let windowsBuilder
let seatsBuilder
let vehicleBuilder

export function initApp() {
    // Chassis builder
    if (document.querySelector('#chassis-div')) {
        chassisBuilder = new ChassisBuilder()
    }

    // Engine builder
    if (document.querySelector('#engine-div')) {
        engineBuilder = new EngineBuilder()
        engineBuilder.setChassisBuilder(chassisBuilder)
    }

    // Tires builder
    if (document.querySelector('#tires-div')) {
        tiresBuilder = new TiresBuilder()
        tiresBuilder.setChassisBuilder(chassisBuilder)
    }

    // Doors builder
    if (document.querySelector('#doors-div')) {
        doorsBuilder = new DoorsBuilder()
        doorsBuilder.setChassisBuilder(chassisBuilder)
    }

    // Windows builder
    if (document.querySelector('#windows-div')) {
        windowsBuilder = new WindowsBuilder()
        windowsBuilder.setChassisBuilder(chassisBuilder)
        windowsBuilder.setDoorsBuilder(doorsBuilder)
    }

    // Seats builder
    if (document.querySelector('#seats-div')) {
        seatsBuilder = new SeatsBuilder()
        seatsBuilder.setChassisBuilder(chassisBuilder)
    }


    // Vehicle builder
    if (document.querySelector('#create-button')) {
        vehicleBuilder = new VehicleBuilder()
        vehicleBuilder.setChassisBuilder(chassisBuilder)
        vehicleBuilder.setEngineBuilder(engineBuilder)
        vehicleBuilder.setTiresBuilder(tiresBuilder)
        vehicleBuilder.setDoorsBuilder(doorsBuilder)
        vehicleBuilder.setWindowsBuilder(windowsBuilder)
        vehicleBuilder.setSeatsBuilder(seatsBuilder)
    }

    // Vehicle editor
    if (document.querySelector('#editor-console')) {
        const vehicleEditor = new VehicleEditor()
        vehicleEditor.setVehicleBuilder(vehicleBuilder)
    }
}
