/**
 * Represents allowable engine configurations
 * @class
 */
export class EngineConfig {
    /**
     * Validate engine configuration for transmission type, gears, fuel type, and size for vehicle type
     * @method
     * @static
     * @param {object} engine
     * @returns {boolean}
     */
    static validateEngineConfig(engine) {
        const validFuel = this.checkValidFuel(engine.transmission, engine.fuel)
        const validSize = this.checkValidSize(engine.vehicleType, engine.size, engine.fuel)
        const validGear = this.checkValidGear(engine.transmission, engine.gear)
        return validGear && validSize && validFuel
    }

    /**
     * Get allowed engine fuel types based on transmission type
     * @method
     * @static
     * @param {string} transmissionType 'automatic' or 'manual'
     * @returns {string[]} combination of 'gasoline', 'diesel', 'hybrid', 'electric'
     */
    static getAllowedEngineFuels(transmissionType) {
        const manualFuels = ['gasoline', 'diesel']
        const allFuels = ['gasoline', 'diesel', 'electric', 'hybrid']
        return transmissionType == 'automatic' ? allFuels : manualFuels
    }

    /**
     * Get allowed engine sizes (in Liters or kWh) based on
     * vehicle type and fuel type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'semi-truck', 'bus'
     * @param {string} fuelType 'gasoline', 'diesel', 'hybrid', 'electric'
     * @returns {number[]} [minSize, maxSize]
     */
    static getAllowedEngineSizes(vehicleType, fuelType) {
        const literFuel = ['gasoline', 'diesel', 'hybrid']
        switch (vehicleType) {
            case 'motorcycle':
                switch (fuelType) {
                    case 'electric':
                        return [5.0, 20.0]
                    default:
                        return [0.1, 2.0]
                }
            case 'car':
            case 'suv':
                switch (fuelType) {
                    case 'electric':
                        return [20.0, 100.0]
                    default:
                        return [0.5, 6.0]
                }
            case 'van':
                switch (fuelType) {
                    case 'electric':
                        return [30.0, 120.0]
                    default:
                        return [2.0, 5.0]
                }
            case 'truck':
                switch (fuelType) {
                    case 'electric':
                        return [40.0, 200.0]
                    default:
                        return [2.5, 6.0]
                }
            case 'semi-truck':
                switch (fuelType) {
                    case 'electric':
                        return [300.0, 1000.0]
                    default:
                        return [9.0, 15.0]
                }
            case 'bus':
                switch (fuelType) {
                    case 'electric':
                        return [100.0, 600.0]
                    default:
                        return [4.0, 15.0]
                }
            default:
                return []
        }
    }

    /**
     * Get allowed engine gears based on transmission type
     * @method
     * @static
     * @param {string} transmissionType 'automatic' or 'manual'
     * @returns {string[]} combination of 'park', 'neutral', 'drive', 'reverse', '1st', '2nd', '3rd', '4th', '5th'
     */
    static getAllowedEngineGears(transmissionType) {
        const autoGears = ['park', 'neutral', 'reverse', 'drive']
        const manualGears = ['reverse', 'neutral', 'park', '1st', '2nd', '3rd', '4th', '5th']
        return transmissionType == 'automatic' ? autoGears : manualGears
    }

    /**
     * Check whether current gear is valid for transmission type
     * @method
     * @static
     * @param {string} transmissionType 'automatic' or 'manual'
     * @param {string} currentGear 'park', 'neutral', 'drive', 'reverse', '1st', '2nd', '3rd', '4th', '5th'
     * @returns {boolean}
     */
    static checkValidGear(transmissionType, currentGear) {
        const allowedGears = this.getAllowedEngineGears(transmissionType)
        let isValid = true
        if (!allowedGears.includes(currentGear)) { isValid = false }
        return isValid
    }

    /**
     * Check whether engine size valid for  vehicle type and fuel type
     * @method
     * @static
     * @param {string} vehicleType 'motorcycle', 'car', 'suv', 'van', 'truck', 'bus'
     * @param {number} engineSize (liters)
     * @param {string} fuelType 'gasoline', 'diesel', 'hybrid', 'electric'
     * @returns {boolean}
     */
    static checkValidSize(vehicleType, engineSize, fuelType) {
        const allowedSizes = this.getAllowedEngineSizes(vehicleType, fuelType)
        let isValid = true
        if (engineSize < allowedSizes[0] || engineSize > allowedSizes[1]) { isValid = false }
        return isValid
    }

    /**
     * Check whether fuel type valid for transmission type
     * @method
     * @static
     * @param {string} transmissionType 'automatic' or 'manual'
     * @param {string} fuelType 'gasoline', 'diesel', 'hybrid', 'electric'
     * @returns {boolean}
     */
    static checkValidFuel(transmissionType, fuelType) {
        const allowedFuels = this.getAllowedEngineFuels(transmissionType)
        let isValid = true
        if (!allowedFuels.includes(fuelType)) { isValid = false }
        return isValid
    }
}
