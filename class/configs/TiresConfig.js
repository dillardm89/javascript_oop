/** Represents allowable tires configurations
 * @class
 */
export class TiresConfig {
    /**
     * Validate tire configuration for number, size, and pressure
     * @method
     * @static
     * @param {object} tires
     * @returns {boolean}
     */
    static validateTireConfig(tires) {
        const validCount = this.checkValidTireCount(tires.vehicleType, tires.number)
        const validSize = this.checkValidSize(tires.vehicleType, tires.size)
        const validPressure = this.checkValidPressure(tires.vehicleType, tires.pressure)
        return validCount && validSize && validPressure
    }

    /**
     * Get allowed number of tires based on vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @returns {number[]}
     */
    static getAllowedNumberTires(vehicleType) {
        switch (vehicleType) {
            case 'motorcycle':
                return [2, 3]
            case 'car':
            case 'van':
            case 'suv':
                return [4]
            case 'truck':
                return [4, 6]
            case 'semi-truck':
                return [10, 18]
            case 'bus':
                return [6, 8, 10, 12]
            default:
                return []
        }
    }

    /**
     * Get allowed tire sizes (inches) based on vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @returns {number[]} [minSize, maxSize]
     */
    static getAllowedTireSizes(vehicleType) {
        switch (vehicleType) {
            case 'motorcycle':
                return [16, 21]
            case 'car':
                return [14, 20]
            case 'suv':
            case 'van':
            case 'truck':
                return [15, 22]
            case 'semi-truck':
                return [22, 25]
            case 'bus':
                return [19, 25]
            default:
                return []
        }
    }

    /**
     * Get allowed tire pressure range (psi) based on vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @returns {number[]} [minPressure, maxPressure]
     */
    static getAllowedTirePressure(vehicleType) {
        switch (vehicleType) {
            case 'motorcycle':
                return [28, 42]
            case 'car':
                return [30, 35]
            case 'suv':
                return [30, 40]
            case 'van':
            case 'truck':
                return [30, 50]
            case 'semi-truck':
                return [75, 100]
            case 'bus':
                return [80, 120]
            default:
                return []
        }
    }

    /**
     * Check whether number of tires is valid for vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @param {number} tireCount
     * @returns {boolean}
     */
    static checkValidTireCount(vehicleType, tireCount) {
        const allowedCount = this.getAllowedNumberTires(vehicleType)
        let isValid = true
        if (!allowedCount.includes(tireCount)) { isValid = false }
        return isValid
    }

    /**
     * Check whether tire pressure valid for size
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @param {number} tirePressure (psi)
     * @returns {boolean}
     */
    static checkValidPressure(vehicleType, tirePressure) {
        const pressureRange = this.getAllowedTirePressure(vehicleType)
        let isValid = true
        if (tirePressure < pressureRange[0] || tirePressure > pressureRange[1]) { isValid = false }
        return isValid
    }

    /**
     * Check whether tire size valid for vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @param {number} tireSize (inches)
     * @returns {boolean}
     */
    static checkValidSize(vehicleType, tireSize) {
        const sizeRange = this.getAllowedTireSizes(vehicleType)
        let isValid = true
        if (tireSize < sizeRange[0] || tireSize > sizeRange[1]) { isValid = false }
        return isValid
    }
}
