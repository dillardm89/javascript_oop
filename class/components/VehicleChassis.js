import { ErrorMessage } from '../utils/ErrorMessage.js'
import { ChassisConfig } from '../configs/ChassisConfig.js'
import { Engine } from './Engine.js'
import { EngineConfig } from '../configs/EngineConfig.js'
import { Tires } from './Tires.js'
import { TiresConfig } from '../configs/TiresConfig.js'
import { Window } from './Window.js'
import { Seat } from './Seat.js'
import { Door } from './Door.js'

// Allowed vehicle type strings
const VEHICLE_TYPES = ['motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus']

/** Represents a vehicle
 * @class
 */
export class VehicleChassis {
    /**
     * Creates a new vehicle chassis
     * @param {string} year
     * @param {string} make
     * @param {string} model
     * @param {string} color
     * @param {string} type 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     */
    constructor(year, make, model, color, type) {
        this.#validateType(type)
        this.year = year
        this.make = make
        this.model = model
        this.color = color
        this.type = type.toLowerCase()
        this._engine = null
        this._tires = null
        this._windows = null
        this._doors = null
        this._seats = null
    }

    /**
     * Validate vehicle type string before instance created
     * @method
     * @private
     * @param {string} type
     * @returns {void}
     */
    #validateType(type) {
        if (!VEHICLE_TYPES.includes(type.toLowerCase())) { return ErrorMessage.customLogOnly('invalid vehicle type') }
    }

    /**
     * Add / change vehicle engine
     * @method
     * @param {object} newEngine
     * @returns {boolean} whether successful
     */
    set engine(newEngine) {
        if (!(newEngine instanceof Engine)) {
            ErrorMessage.invalidInstance('engine')
            return false
        }

        if (!EngineConfig.validateEngineConfig(newEngine)) {
            ErrorMessage.invalidConfig('engine')
            return false
        }

        this._engine = newEngine
        return true
    }

    /**
     * Add / change set of tires for vehicle
     * @method
     * @param {object} newTires
     * @returns {boolean} whether successful
     */
    set tires(newTires) {
        if (!(newTires instanceof Tires)) {
            ErrorMessage.invalidInstance('tires')
            return false
        }

        if (!TiresConfig.validateTireConfig(newTires)) {
            ErrorMessage.invalidConfig('tires')
            return false
        }

        this._tires = newTires
        return true
    }

    /**
     * Add array of window instances for vehicle
     * @method
     * @param {object[]} windows
     * @returns {boolean} whether successful
     */
    addAllWindows(windows) {
        if (!ChassisConfig.checkValidWindowCount(this.type, windows.length)) {
            ErrorMessage.invalidConfig('windows')
            return false
        }

        if (!Array.isArray(windows) || !windows.every(window => window instanceof Window)) {
            ErrorMessage.invalidInstance('window')
            return false
        }

        this._windows = windows
        return true
    }

    /**
     * Add array of door instances for vehicle
     * @method
     * @param {object[]} doors
     * @returns {boolean} whether successful
     */
    addAllDoors(doors) {
        if (!ChassisConfig.checkValidDoorCount(this.type, doors.length)) {
            ErrorMessage.invalidConfig('doors')
            return false
        }

        if (!Array.isArray(doors) || !doors.every(door => door instanceof Door)) {
            ErrorMessage.invalidInstance('door')
            return false
        }

        this._doors = doors
        return true
    }

    /**
     * Add array of seat instances for vehicle
     * @method
     * @param {object[]} seats
     * @returns {boolean} whether successful
     */
    addAllSeats(seats) {
        if (!ChassisConfig.checkValidSeatCount(this.type, seats.length)) {
            ErrorMessage.invalidConfig('seats')
            return false
        }

        if (!Array.isArray(seats) || !seats.every(seat => seat instanceof Seat)) {
            ErrorMessage.invalidInstance('seat')
            return false
        }

        this._seats = seats
        return true
    }

    /**
     * Get current details about engine
     * @method
     * @returns {object | null}
     */
    getEngineDetails() { return this._engine }

    /**
     * Start vehicle engine
     * @method
     * @returns {boolean} whether successful
     */
    startEngine() {
        if (!this._engine) {
            ErrorMessage.notFound('engine')
            return false
        }

        return this._engine.setIsRunning(true)
    }

    /**
     * Stop vehicle engine
     * @method
     * @returns {boolean} whether successful
    */
    stopEngine() {
        if (!this._engine) {
            ErrorMessage.notFound('engine')
            return false
        }

        return this._engine.setIsRunning(false)
    }

    /**
     * Get current tire details
     * @method
     * @returns {object | null}
     */
    getTiresDetails() { return this._tires }

    /**
     * Get index of window in vehicle array by name
     * @method
     * @private
     * @param {string} name
     * @returns {number}
     */
    #getWindowIndex(name) { return this._windows.findIndex(window => window.name == name) }

    /**
     * Get index of door in vehicle array by name
     * @method
     * @private
     * @param {string} name
     * @returns {number}
     */
    #getDoorIndex(name) { return this._doors.findIndex(door => door.name == name) }

    /**
     * Get index of seat in vehicle array by name
     * @method
     * @private
     * @param {string} name
     * @returns {number}
     */
    #getSeatIndex(name) { return this._seats.findIndex(seat => seat.name == name) }

    /**
     * Get all window names
     * @method
     * @returns {string[]}
     */
    getWindowNames() {
        let windowNames = []
        for (const window of this._windows) { windowNames.push(window.name) }
        return windowNames
    }

    /**
     * Get details for specific window
     * @method
     * @param {string} windowName
     * @returns {object | null}
     */
    getWindowDetails(windowName) {
        const windowNum = this.#getWindowIndex(windowName)
        if (windowNum == -1) { return ErrorMessage.notFound('window') }
        return this._windows[windowNum]
    }

    /**
     * Set new window position
     * Checks if window is operable and new position not
     * the same as current position
     * @method
     * @param {string} windowName
     * @param {number} newPosition (0-100) represents percentage open
     * @returns {boolean} whether successful
     */
    setWindowPosition(windowName, newPosition) {
        const windowNum = this.#getWindowIndex(windowName)
        if (windowNum == -1) {
            ErrorMessage.notFound('window')
            return false
        }

        let result = true
        result = this._windows[windowNum].setPosition(newPosition)
        if (this._windows[windowNum].inDoor) {
            const doorNum = this.#getDoorIndex(windowName)
            if (doorNum == -1) {
                ErrorMessage.notFound('door')
                return false
            }
            result = this._doors[doorNum].setWindowPosition(newPosition)
        }

        return result
    }

    /**
     * Open all vehicle windows (if operable)
     * @method
     */
    openAllWindows() {
        this._windows.forEach(window => { if (window.isOperable) { this.setWindowPosition(window.name, 100) } })
    }

    /**
     * Close all vehicle windows (if operable)
     * @method
     */
    closeAllWindows() {
        this._windows.forEach(window => { if (window.isOperable) { this.setWindowPosition(window.name, 0) } })
    }

    /**
     * Get all door names
     * @method
     * @returns {string[]}
     */
    getDoorNames() {
        let doorNames = []
        for (const door of this._doors) { doorNames.push(door.name) }
        return doorNames
    }

    /**
     * Get details for specific door
     * @method
     * @param {string} doorName
     * @returns {object | null}
     */
    getDoorDetails(doorName) {
        const doorNum = this.#getDoorIndex(doorName)
        if (doorNum == -1) { return ErrorMessage.notFound('door') }
        return this._doors[doorNum]
    }

    /**
     * Set new position for specific door
     * @method
     * @param {string} doorName
     * @param {number} newPosition (0-100) represents percentage open
     * @returns {boolean} whether successful
     */
    setDoorPosition(doorName, newPosition) {
        const doorNum = this.#getDoorIndex(doorName)
        if (doorNum == -1) {
            ErrorMessage.notFound('door')
            return false
        }

        return this._doors[doorNum].setPosition(newPosition)
    }

    /**
     * Lock all vehicle doors
     * @method
     */
    lockAllDoors() { this._doors.forEach(door => door.setIsLocked(true)) }

    /**
     * Unlock all vehicle doors
     * @method
     */
    unlockAllDoors() { this._doors.forEach(door => door.setIsLocked(false)) }

    /**
     * Lock specific vehicle door
     * @method
     * @param {string} doorName
     * @returns {boolean} whether successful
     */
    lockDoor(doorName) {
        const doorNum = this.#getDoorIndex(doorName)
        if (doorNum == -1) {
            ErrorMessage.notFound('door')
            return false
        }

        return this._doors[doorNum].setIsLocked(true)
    }

    /**
     * Unlock specific vehicle door
     * @method
     * @param {string} doorName
     * @returns {boolean} whether successful
     */
    unlockDoor(doorName) {
        const doorNum = this.#getDoorIndex(doorName)
        if (doorNum == -1) {
            ErrorMessage.notFound('door')
            return false
        }

        return this._doors[doorNum].setIsLocked(false)
    }

    /**
     * Get details about window for specific door
     * @method
     * @param {string} doorName
     * @returns {object | null}
     */
    getDoorWindowDetails(doorName) {
        const doorNum = this.#getDoorIndex(doorName)
        if (doorNum == -1) { return ErrorMessage.notFound('door') }

        if (this._doors[doorNum].hasWindow) { return this._doors[doorNum].window }
        else { return ErrorMessage.doesNotHave('door', 'a window') }
    }

    /**
     * Get all seat names
     * @method
     * @returns {string[]}
     */
    getSeatNames() {
        let seatNames = []
        for (const seat of this._seats) { seatNames.push(seat.name) }
        return seatNames
    }

    /**
     * Get seats about specific seat
     * @method
     * @param {string} seatName
     * @returns {object | null}
     */
    getSeatDetails(seatName) {
        const seatNum = this.#getSeatIndex(seatName)
        if (seatNum == -1) { return ErrorMessage.notFound('seat') }
        return this._seats[seatNum]
    }

    /**
     * Set new seat position
     * @method
     * @param {string} seatName
     * @param {number} newPosition (0-100) for percentage reclined
     * @returns {boolean} whether successful
     */
    setSeatPosition(seatName, newPosition) {
        const seatNum = this.#getSeatIndex(seatName)
        if (seatNum == -1) {
            ErrorMessage.notFound('seat')
            return false
        }

        return this._seats[seatNum].setPosition(newPosition)
    }

    /**
     * Set new seat heading setting
     * @method
     * @param {string} seatName
     * @param {number} newSetting (0, 1, 2, 3) for 'off', 'low', 'medium', 'high'
     * @returns {boolean} whether successful
     */
    setSeatHeatSetting(seatName, newSetting) {
        const seatNum = this.#getSeatIndex(seatName)
        if (seatNum == -1) {
            ErrorMessage.notFound('seat')
            return false
        }

        return this._seats[seatNum].setHeatSetting(newSetting)
    }

    /**
     * Set new seat cooling setting
     * @method
     * @param {string} seatName
     * @param {number} newSetting (0, 1, 2, 3) for 'off', 'low', 'medium', 'high'
     * @returns {boolean} whether successful
     */
    setSeatCoolSetting(seatName, newSetting) {
        const seatNum = this.#getSeatIndex(seatName)
        if (seatNum == -1) {
            ErrorMessage.notFound('seat')
            return false
        }

        return this._seats[seatNum].setCoolSetting(newSetting)
    }
}
