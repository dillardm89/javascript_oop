import { ChassisBuilder } from './ChassisBuilder.js'
import { EngineBuilder } from './EngineBuilder.js'
import { TiresBuilder } from './TiresBuilder.js'
import { DoorsBuilder } from './DoorsBuilder.js'
import { WindowsBuilder } from './WindowsBuilder.js'
import { SeatsBuilder } from './SeatsBuilder.js'
import { VehicleChassis } from '../components/VehicleChassis.js'
import { Engine } from '../components/Engine.js'
import { Tires } from '../components/Tires.js'
import { Door } from '../components/Door.js'
import { Window } from '../components/Window.js'
import { Seat } from '../components/Seat.js'
import { ErrorMessage } from '../utils/ErrorMessage.js'

/**
 * Represents an interactive vehicle builder
 * @class
 */
export class VehicleBuilder {
    /** Creates a new vehicle builder */
    constructor() {
        this.form = document.querySelector('#vehicle-form')
        this.createBtn = document.querySelector('#create-button')
        this.chassisBuilder = null
        this.engineBuilder = null
        this.engine = null
        this.tiresBuilder = null
        this.tires = null
        this.doorsBuilder = null
        this.doors = []
        this.windowsBuilder = null
        this.windows = []
        this.seatsBuilder = null
        this.seats = []
        this.vehicle = null
        this.#vehicleEventListeners()
    }

    /**
     * Set chassis builder instance
     * @method
     * @param {string} newChassis
     */
    setChassisBuilder(newChassis) {
        if (newChassis instanceof ChassisBuilder) { this.chassisBuilder = newChassis }
        else { ErrorMessage.invalidInstance('chassis builder') }
    }

    /**
     * Set engine builder instance
     * @method
     * @param {string} newEngine
     */
    setEngineBuilder(newEngine) {
        if (newEngine instanceof EngineBuilder) { this.engineBuilder = newEngine }
        else { ErrorMessage.invalidInstance('engine builder') }
    }

    /**
     * Set tires builder instance
     * @method
     * @param {string} newTires
     */
    setTiresBuilder(newTires) {
        if (newTires instanceof TiresBuilder) { this.tiresBuilder = newTires }
        else { ErrorMessage.invalidInstance('tires builder') }
    }

    /**
     * Set doors builder instance
     * @method
     * @param {string} newDoors
     */
    setDoorsBuilder(newDoors) {
        if (newDoors instanceof DoorsBuilder) { this.doorsBuilder = newDoors }
        else { ErrorMessage.invalidInstance('doors builder') }
    }

    /**
     * Set windows builder instance
     * @method
     * @param {string} newWindows
     */
    setWindowsBuilder(newWindows) {
        if (newWindows instanceof WindowsBuilder) { this.windowsBuilder = newWindows }
        else { ErrorMessage.invalidInstance('windows builder') }
    }

    /**
     * Set seats builder instance
     * @method
     * @param {string} newSeats
     */
    setSeatsBuilder(newSeats) {
        if (newSeats instanceof SeatsBuilder) { this.seatsBuilder = newSeats }
        else { ErrorMessage.invalidInstance('seats builder') }
    }

    /**
     * Add event listeners to click save seats button and create vehicle
     * @method
     * @private
     */
    #vehicleEventListeners() {
        this.createBtn.addEventListener('click', (event) => {
            event.preventDefault()
            document.querySelector('#save-seats-button').click()
            this.#createVehicleComponents()
        })
    }


    /**
     * Get final builder components to create instances
     * @method
     * @private
     */
    #createVehicleComponents() {
        const chassisObject = this.chassisBuilder.getChassis()
        this.vehicle = this.#createVehicleChassisInstance(chassisObject)

        const engineObject = this.engineBuilder.getEngine()
        this.engine = this.#createEngineInstance(engineObject)

        const tiresObject = this.tiresBuilder.getTires()
        this.tires = this.#createTiresInstance(tiresObject)

        const windowsArray = this.windowsBuilder.getWindowsArray()
        this.windows = this.#createWindowsInstanceArray(windowsArray)

        const doorsArray = this.doorsBuilder.getDoorsArray()
        this.doors = this.#createDoorsInstanceArray(doorsArray)

        const seatsArray = this.seatsBuilder.getSeatsArray()
        this.seats = this.#createSeatsInstanceArray(seatsArray)

        this.#updateVehicleChassisInstance()
        this.#viewEditorConsole()
    }

    /**
     * Create instance of VehicleChassis class
     * @method
     * @private
     * @param {object} chassisObject
     * @returns {object}
     */
    #createVehicleChassisInstance(chassisObject) {
        return new VehicleChassis(chassisObject.year, chassisObject.make, chassisObject.model, chassisObject.color, chassisObject.type)
    }

    /**
     * Create instance of Engine class
     * @method
     * @private
     * @param {object} engineObject
     * @returns {object}
     */
    #createEngineInstance(engineObject) {
        return new Engine(engineObject.vehicleType, engineObject.fuel, engineObject.size, engineObject.transmission)
    }

    /**
     * Create instance of Tires class
     * @method
     * @private
     * @param {object} tiresObject
     * @returns {object}
     */
    #createTiresInstance(tiresObject) {
        return new Tires(tiresObject.vehicleType, tiresObject.number, tiresObject.size, tiresObject.pressure)
    }

    /**
     * Create array of instances of Window class
     * @method
     * @private
     * @param {object[]} windowsArray
     * @returns {object[]}
     */
    #createWindowsInstanceArray(windowsArray) {
        let windows = []
        for (const windowObject of windowsArray) {
            const window = new Window(windowObject.name, windowObject.inDoor, windowObject.isOperable, windowObject.operationType)
            if (window instanceof Window) { windows.push(window) }
        }
        return windows
    }

    /**
     * Create array of instances of Door class
     * @method
     * @private
     * @param {object[]} doorsArray
     * @returns {object[]}
     */
    #createDoorsInstanceArray(doorsArray) {
        let doors = []
        for (const doorObject of doorsArray) {
            const door = new Door(doorObject.name, doorObject.hasWindow, doorObject.hingeType)
            if (door instanceof Door) {
                for (const window of this.windows) {
                    if (window.name == door.name) {
                        door.setWindow(window)
                        break
                    }
                }
                doors.push(door)
            }
        }
        return doors
    }

    /**
     * Create array of instances of Seats class
     * @method
     * @private
     * @param {object[]} seatsArray
     * @returns {object[]}
     */
    #createSeatsInstanceArray(seatsArray) {
        let seats = []
        for (const seatObject of seatsArray) {
            const seat = new Seat(seatObject.name, seatObject.material, seatObject.color, seatObject.isOperable, seatObject.operationType, seatObject.hasHeat, seatObject.hasCool)
            if (seat instanceof Seat) { seats.push(seat) }
        }
        return seats
    }

    /**
     * Update instance of VehicleChassis class to include engine, tires, doors, seats, and windows
     * @method
     * @private
     */
    #updateVehicleChassisInstance() {
        this.vehicle.engine = this.engine
        this.vehicle.tires = this.tires
        this.vehicle.addAllDoors(this.doors)
        this.vehicle.addAllWindows(this.windows)
        this.vehicle.addAllSeats(this.seats)
    }

    /**
     * Hide Builder Console and View Editor Console
     * @method
     * @private
     */
    #viewEditorConsole() {
        document.querySelector('#builder-console').classList.add('d-none')
        document.querySelector('#editor-console').classList.remove('d-none')
        document.querySelector('#header-h1').innerHTML = 'Vehicle Editor'
        document.querySelector('#page-title').innerHTML = 'Vehicle Editor'
        document.querySelector('#load-vehicle-instance-button').click()
    }

    /**
     * Get instance of VehicleChassis class
     * @method
     * @returns {object | null}
     */
    getVehicleInstance() {
        if (!this.vehicle instanceof VehicleChassis) { return ErrorMessage.invalidInstance('vehicle chassis') }
        return this.vehicle
    }
}
