import { EngineConfig } from '../configs/EngineConfig.js'
import { ErrorMessage } from '../utils/ErrorMessage.js'

/**
 * Represents an engine
 * @class
 */
export class Engine {
    /**
     * Creates a new engine
     * @param {string} fuel
     * @param {number} size (Liters || kWh)
     * @param {string} transmission 'automatic' or 'manual'
     * @param {string} gear
     * @param {number} speed (MPH)
     * @param {boolean} isRunning
     * @param {number} fuelLevel (0-100) represents percentage full
     */
    constructor(vehicleType, fuel, size, transmission, gear = 'park', speed = 0, isRunning = false, fuelLevel = 0) {
        this.vehicleType = vehicleType
        this.fuel = fuel
        this.size = size
        this.transmission = transmission
        this.gear = gear
        this.speed = speed
        this.isRunning = isRunning
        this.fuelLevel = fuelLevel
    }


    /**
     * Set new fuel type
     * Checks if new type is valid for transmission type and not
     * the same as current fuel type
     * @method
     * @param {string} newFuel (limited by VehicleConfig)
     * @returns {boolean} whether successful
     */
    setFuel(newFuel) {
        if (newFuel == this.fuel) {
            ErrorMessage.noChange('fuel type')
            return false
        }

        if (this.isRunning) {
            ErrorMessage.cannotWhile('fuel type', 'changed', 'engine is on')
            return false
        }

        if (!EngineConfig.checkValidFuel(this.transmission, newFuel)) {
            ErrorMessage.notValid('fuel type', 'transmission type')
            return false
        }

        this.fuel = newFuel
        if (!EngineConfig.checkValidSize(this.vehicleType, this.size, newFuel)) {
            const firstValidSize = EngineConfig.getAllowedEngineSizes(this.vehicleType, newFuel)[0]
            this.size = firstValidSize
            ErrorMessage.updated('engine size', firstValidSize, 'fuel type')
        }

        return true
    }

    /**
     * Set new engine size (Liters || kWh)
     * Checks if new size is valid for vehicle type and not
     * the same as current engine size
     * @method
     * @param {number} newSize (limited by VehicleConfig)
     * @returns {boolean} whether successful
     */
    setSize(newSize) {
        if (newSize == this.size) {
            ErrorMessage.noChange('engine size')
            return false
        }

        if (this.isRunning) {
            ErrorMessage.cannotWhile('engine size', 'changed', 'engine is on')
            return false
        }

        if (!EngineConfig.checkValidSize(this.vehicleType, newSize, this.fuel)) {
            ErrorMessage.notValid('engine size', 'vehicle and fuel types')
            return false
        }

        this.size = newSize
        return true
    }

    /**
     * Set new transmission type
     * Checks for type not the same as current transmission
     * and updates engine fuel and size accordingly
     * @method
     * @param {string} newType 'automatic' or 'manual'
     * @returns {boolean} whether successful
     */
    setTransmission(newType) {
        if (newType == this.transmission) {
            ErrorMessage.noChange('transmission type')
            return false
        }

        if (this.isRunning) {
            ErrorMessage.cannotWhile('transmission', 'changed', 'engine is on')
            return false
        }

        this.transmission = newType
        let validFuel = this.fuel
        if (!EngineConfig.checkValidFuel(newType, this.fuel)) {
            validFuel = EngineConfig.getAllowedEngineFuels(newType)[0]
            this.fuel = validFuel
            ErrorMessage.updated('fuel type', validFuel, 'transmission type')
        }

        if (!EngineConfig.checkValidSize(this.vehicleType, this.size, validFuel)) {
            const firstValidSize = EngineConfig.getAllowedEngineSizes(this.vehicleType, validFuel)[0]
            this.size = firstValidSize
            ErrorMessage.updated('engine size', firstValidSize, 'fuel type')
        }

        return true
    }

    /**
     * Set new engine gear
     * Checks for gear not the same as current
     * and verifies proper speed and engine running status
     * @method
     * @param {string} newGear (limited by VehicleConfig)
     * @returns {boolean} whether successful
     */
    setGear(newGear) {
        if (newGear == this.gear) {
            ErrorMessage.noChange('engine gear')
            return false
        }

        if (!this.isRunning && !(newGear == 'neutral' || newGear == 'park')) {
            ErrorMessage.cannotWhile('gear', `changed to ${newGear}`, 'engine is off')
            return false
        }

        if (!EngineConfig.checkValidGear(this.transmission, newGear)) {
            ErrorMessage.notValid('engine gear', 'transmission type')
            return false
        }

        const stoppedAutoGears = ['park', 'reverse', 'drive']
        if (stoppedAutoGears.includes(newGear) && this.gear != 'neutral' && this.speed != 0) {
            ErrorMessage.cannotWhile('gear', `changed to ${newGear}`, 'vehicle speed exceeds 0 mph')
            return false
        }

        if (this.gear == 'reverse' && newGear != 'neutral' && this.speed != 0) {
            ErrorMessage.cannotWhile('gear', `changed to ${newGear}`, 'vehicle speed exceeds 0 mph')
            return false
        }

        this.gear = newGear
        return true
    }

    /**
     * Set new speed
     * Checks for speed not the same as current
     * and verifies proper gear and engine running status
     * @method
     * @param {number} newSpeed (MPH)
     */
    setSpeed(newSpeed) {
        if (newSpeed == this.speed) {
            ErrorMessage.noChange('speed')
            return false
        }

        if (!this.isRunning) {
            ErrorMessage.cannotWhile('speed', 'changed', 'engine is off')
            return false
        }

        if (this.gear == 'park' || this.gear == 'neutral') {
            ErrorMessage.cannotWhile('speed', 'changed', `engine is in ${this.gear}`)
            return false
        }

        if (this.fuelLevel == 0) {
            ErrorMessage.cannotWhile('speed', 'changed', 'engine has 0 fuel')
            return false
        }

        this.speed = newSpeed
        return true
    }

    /**
     * Set new engine running status (on / off)
     * Checks for type not the same as current
     * and verifies proper gear to change running status
     * @method
     * @param {boolean} newStatus
     */
    setIsRunning(newStatus) {
        if (newStatus == this.isRunning) {
            const message = `The engine is already ${this.isRunning ? 'on' : 'off'}.`
            ErrorMessage.customLogOnly(message)
            return false
        }

        if (!(this.gear == 'park' || this.gear == 'neutral')) {
            const action = `turn engine ${newStatus ? 'on' : 'off'}`
            ErrorMessage.mustBe('gear', 'in "park" or "neutral"', action)
            return false
        }

        this.isRunning = newStatus
        return true
    }

    /**
     * Set new fuel level
     * Checks for level not the same as current
     * and new level greater than current
     * @method
     * @param {number} newLevel (0-100) represents percentage full
     */
    setFuelLevel(newLevel) {
        if (this.isRunning) {
            ErrorMessage.mustBe('engine', 'off', 'change fuel level')
            return false
        }

        if (newLevel == this.fuelLevel) {
            ErrorMessage.noChange('fuel level')
            return false
        }

        if (newLevel < 0 || newLevel > 100) {
            ErrorMessage.customModal('fuel level must be 0-100%')
            return false
        }

        this.fuelLevel = newLevel
        return true
    }
}
