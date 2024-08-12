import { ErrorMessage } from '../utils/ErrorMessage.js'

/**
 * Represents a window
 * @class
 */
export class Window {
    /**
     * Creates a new window
     * @param {string} name
     * @param {boolean} inDoor
     * @param {boolean} isOperable
     * @param {string} type 'none', 'electric', 'manual'
     * @param {number} position (0-100) represent percentage open
     */
    constructor(name, inDoor = false, isOperable = false, type = 'none', position = 0) {
        this.name = name
        this.inDoor = inDoor
        this.isOperable = isOperable
        this.type = type
        this.position = position
    }


    /**
     * Set new window position
     * @method
     * @param {number} newPosition (0-100) represents percentage open
     * @returns {boolean} whether successful
     */
    setPosition(newPosition) {
        if (!this.isOperable) {
            ErrorMessage.notOperable('window')
            return false
        }

        if (newPosition == this.position) {
            ErrorMessage.noChange('position')
            return false
        }

        if (newPosition < 0 || newPosition > 100) {
            ErrorMessage.customModal('window position must be 0-100%')
            return false
        }

        this.position = newPosition
        return true
    }
}
