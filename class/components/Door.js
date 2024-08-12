import { ErrorMessage } from '../utils/ErrorMessage.js'
import { Window } from './Window.js'

/**
 * Represents a door
 * @class
 */
export class Door {
    /**
     * Creates a new door
     * @param {string} name
     * @param {string} hingeType 'standard', 'gull-wing', 'hatchback', 'trunk', 'scissor', 'sliding', 'bifold'
     * @param {boolean} isLocked
     * @param {number} position (0-100) represents percentage open
     */
    constructor(name, hasWindow = false, hingeType = 'standard', isLocked = true, position = 0) {
        this.name = name
        this.hasWindow = hasWindow
        this.hingeType = hingeType
        this.isLocked = isLocked
        this.position = position
        this.window = null
    }

    /**
     * Add / change window in door
     * @method
     * @param {object} newWindow
     * @returns {boolean} whether successful
     */
    setWindow(newWindow) {
        if (!(newWindow instanceof Window)) {
            ErrorMessage.invalidInstance('window')
            return false
        }

        this.window = newWindow
        this.hasWindow = true
        return true
    }

    /**
     * Set new window position
     * @method
     * @param {number} newPosition (0-100) represents percentage open
     * @returns {boolean} whether successful
     */
    setWindowPosition(newPosition) {
        if (!this.window.isOperable) {
            ErrorMessage.notOperable('window')
            return false
        }

        if (newPosition == this.window.position) {
            ErrorMessage.noChange('position')
            return false
        }

        if (newPosition < 0 || newPosition > 100) {
            ErrorMessage.customModal('window position must be 0-100%')
            return false
        }

        this.window.position = newPosition
        return true
    }

    /**
     * Set new door position
     * Checks whether door is locked if trying to open
     * and new position not the same as current position
     * @method
     * @param {number} newPosition (0-100) represents percentage open
     * @returns {boolean} whether successful
     */
    setPosition(newPosition) {
        if (newPosition == this.position) {
            ErrorMessage.noChange('position')
            return false
        }

        if (this.position == 0 && this.isLocked) {
            ErrorMessage.cannotWhile('door', 'opened', 'locked')
            return false
        }

        if (newPosition < 0 || newPosition > 100) {
            ErrorMessage.customModal('door position must be 0-100%')
            return false
        }

        if (newPosition == 0 && this.isLocked) {
            ErrorMessage.cannotWhile('door', 'closed', 'lock is engaged')
            return false
        }

        this.position = newPosition
        return true
    }

    /**
     * Set whether door is locked
     * @method
     * @param {boolean} newIsLocked
     * @returns {boolean} whether successful
     */
    setIsLocked(newIsLocked) {
        if (this.isLocked == newIsLocked) {
            const message = `the door is already ${this.isLocked ? 'locked' : 'unlocked'}`
            ErrorMessage.customLogOnly(message)
            return false
        }

        if (this.position != 0 && newIsLocked) {
            ErrorMessage.cannotWhile(this.name, 'locked', 'it is open')
            return false
        }

        this.isLocked = newIsLocked
        return true
    }
}
