/**
 * Represents allowable vehicle chassis configurations
 * @class
 */
export class ChassisConfig {
    /**
     * Get allowed number of windows based on vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @returns {number[]} minCount, maxCount
     */
    static getAllowedNumberWindows(vehicleType) {
        switch (vehicleType) {
            case 'motorcycle':
                return [0]
            case 'car':
            case 'truck':
            case 'semi-truck':
                return [3, 6]
            case 'suv':
            case 'van':
                return [3, 8]
            case 'bus':
                return [12, 42]
            default:
                return []
        }
    }

    /**
     * Get allowed number of doors based on vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @returns {number[]} minCount, maxCount
     */
    static getAllowedNumberDoors(vehicleType) {
        switch (vehicleType) {
            case 'motorcycle':
                return [0]
            case 'car':
            case 'suv':
            case 'truck':
            case 'van':
                return [2, 5]
            case 'semi-truck':
            case 'bus':
                return [2, 4]
            default:
                return []
        }
    }

    /**
     * Get allowed number of seats based on vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @returns {number[]} minCount, maxCount
     */
    static getAllowedNumberSeats(vehicleType) {
        switch (vehicleType) {
            case 'motorcycle':
                return [1, 2]
            case 'car':
            case 'truck':
            case 'semi-truck':
                return [2, 5]
            case 'suv':
            case 'van':
                return [5, 8]
            case 'bus':
                return [20, 80]
            default:
                return []
        }
    }

    /**
     * Check whether number of windows is valid for vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @param {number} windowCount
     * @returns {boolean}
     */
    static checkValidWindowCount(vehicleType, windowCount) {
        const allowedCount = this.getAllowedNumberWindows(vehicleType)
        let isValid = true
        if (windowCount < allowedCount[0] || windowCount > allowedCount[1]) { isValid = false }
        return isValid
    }

    /**
     * Check whether number of doors is valid for vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @param {number} doorCount
     * @returns {boolean}
     */
    static checkValidDoorCount(vehicleType, doorCount) {
        const allowedCount = this.getAllowedNumberDoors(vehicleType)
        let isValid = true
        if (doorCount < allowedCount[0] || doorCount > allowedCount[1]) { isValid = false }
        return isValid
    }

    /**
     * Check whether number of seats is valid for vehicle type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @param {number} seatCount
     * @returns {boolean}
     */
    static checkValidSeatCount(vehicleType, seatCount) {
        const allowedCount = this.getAllowedNumberSeats(vehicleType)
        let isValid = true
        if (seatCount < allowedCount[0] || seatCount > allowedCount[1]) { isValid = false }
        return isValid
    }
}
