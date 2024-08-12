import { TiresConfig } from '../configs/TiresConfig.js'
import { ErrorMessage } from '../utils/ErrorMessage.js'

/**
 * Represents a set of tires
 * @class
 */
export class Tires {
    /**
     * Creates a new set of tires
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @param {number} number (2-18 tires, limited by VehicleConfig)
     * @param {number} size (12-40 inches, limited by VehicleConfig)
     * @param {number} pressure (20-120 psi, limited by VehicleConfig)
     */
    constructor(vehicleType, number, size, pressure) {
        this.vehicleType = vehicleType
        this.number = number
        this.size = size
        this.pressure = pressure
    }

    /**
     * Set tire pressure
     * Checks if new pressure is within allow range and new pressure
     * not the same as current pressure
     * @method
     * @param {number} newPressure (20-120 psi, limited by VehicleConfig)
     * @returns {boolean} whether successful
     */
    setPressure(newPressure) {
        if (newPressure == this.pressure) {
            ErrorMessage.noChange('pressure')
            return false
        }

        if (!TiresConfig.checkValidPressure(this.vehicleType, newPressure)) {
            ErrorMessage.notValid('pressure', 'tire size')
            return false
        }

        this.pressure = newPressure
        return true
    }

    /**
     * Set tire size
     * Checks if new size is within allow range and new size
     * not the same as current size
     * @method
     * @param {number} newSize (12-40 inches, limited by VehicleConfig)
     * @returns {boolean} whether successful
     */
    setSize(newSize) {
        if (newSize == this.size) {
            ErrorMessage.noChange('tire size')
            return false
        }

        if (!TiresConfig.checkValidSize(this.vehicleType, newSize)) {
            ErrorMessage.notValid('tire size', 'vehicle type')
            return false
        }

        this.size = newSize
        return true
    }
}
