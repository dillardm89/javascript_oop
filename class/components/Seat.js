import { ErrorMessage } from '../utils/ErrorMessage.js'

/**
 * Represents a seat
 * @class
 */
export class Seat {
    /**
     * Creates a new seat
     * @param {string} name
     * @param {string} material 'leather' or 'cloth'
     * @param {string} color
     * @param {boolean} isOperable
     * @param {string} operationType 'none', 'power', or 'manual'
     * @param {number} position (0-100) represent percentage reclined
     * @param {boolean} hasHeat
     * @param {number} heatSetting (0, 1, 2, 3) for 'off', 'low', 'medium', 'high'
     * @param {boolean} hasCool
     * @param {number} coolSetting (0, 1, 2, 3) for 'off', 'low', 'medium', 'high'
     */
    constructor(name, material, color, isOperable = false, operationType = 'none', hasHeat = false, hasCool = false, position = 0, heatSetting = 0, coolSetting = 0) {
        this.name = name
        this.material = material
        this.color = color
        this.isOperable = isOperable
        this.operationType = operationType
        this.hasHeat = hasHeat
        this.hasCool = hasCool
        this.position = position
        this.heatSetting = heatSetting
        this.coolSetting = coolSetting
    }

    /**
     * Set seat position
     * Checks if seat is operable and new position not
     * the same as current position
     * @method
     * @param {number} newPosition (0-100) represent percentage reclined
     * @returns {boolean} whether successful
     */
    setPosition(newPosition) {
        if (!this.isOperable) {
            ErrorMessage.notOperable('seat')
            return false
        }

        if (newPosition == this.position) {
            ErrorMessage.noChange('position')
            return false
        }

        if (newPosition < 0 || newPosition > 100) {
            ErrorMessage.customModal('seat position must be 0-100%')
            return false
        }

        this.position = newPosition
        return true
    }

    /**
     * Set seat heat setting
     * Checks if seat has heating and new setting not
     * that same as current setting
     * @method
     * @param {number} newSetting (0, 1, 2, 3) for 'off', 'low', 'medium', 'high'
     */
    setHeatSetting(newSetting) {
        console.log('setHeat', this.coolSetting, this.heatSetting, newSetting)
        if (!this.hasHeat) {
            ErrorMessage.doesNotHave('seat', 'heating')
            return false
        }

        if (this.coolSetting != 0) {
            ErrorMessage.cannotWhile('seat heating', 'turned on', 'seat cooling is already on')
            return false
        }

        if (newSetting == this.heatSetting) {
            ErrorMessage.noChange('heat setting')
            return false
        }

        this.heatSetting = newSetting
        return true
    }

    /**
     * Set seat cool setting
     * Checks if seat has cooling and new setting not
     * that same as current setting
     * @method
     * @param {number} newSetting (0, 1, 2, 3) for 'off', 'low', 'medium', 'high'
     */
    setCoolSetting(newSetting) {
        console.log('setCool', this.coolSetting, this.heatSetting, newSetting)
        if (!this.hasCool) {
            ErrorMessage.doesNotHave('seat', 'cooling')
            return false
        }

        if (this.heatSetting != 0) {
            ErrorMessage.cannotWhile('seat cooling', 'turned on', 'seat heating is already on')
            return false
        }

        if (newSetting == this.coolSetting) {
            ErrorMessage.noChange('cool setting')
            return false
        }

        this.coolSetting = newSetting
        return true
    }
}
