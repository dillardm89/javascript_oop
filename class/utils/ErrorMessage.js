/**
 * Represents a custom error message
 * @class
 */
export class ErrorMessage {
    /**
    * Log error message
    * @method
    * @static
    * @private
    * @param {string} message
    */
    static #logMessage(message) { console.log(message) }

    /**
     * Open error modal
     * @method
     * @static
     * @private
     * @param {string} message
     * @param {string} type 'Close' for informational modal or 'Delete' for delete modal
     */
    static #openErrorModal(message, type = 'Close') {
        const fixedMessage = message.charAt(0).toUpperCase() + message.slice(1) + '.'

        document.querySelector('#modal-overlay').classList.remove('d-none')
        document.querySelector('#error-modal').classList.remove('d-none')
        document.querySelector('#modal-message').textContent = fixedMessage

        if (type == 'Close') {
            document.querySelector('#modal-cancel-btn').textContent = 'Close'
            document.querySelector('#modal-delete-btn').classList.add('d-none')
            document.querySelector('#modal-title').textContent = 'Invalid Entry'
        } else {
            document.querySelector('#modal-cancel-btn').textContent = 'Cancel'
            document.querySelector('#modal-delete-btn').classList.remove('d-none')
            document.querySelector('#modal-title').textContent = 'Warning: Vehicle May Be Deleted'
        }

        this.#modalEventListeners()
    }

    /**
     * Add event listeners for modal
     * @method
     * @static
     * @private
     */
    static #modalEventListeners() {
        // Event listener for modal cancel/close button
        document.querySelector('#modal-cancel-btn').addEventListener('click', () => {
            document.querySelector('#modal-overlay').classList.add('d-none')
            document.querySelector('#error-modal').classList.add('d-none')
        })

        // Event listener for modal delete button (to reset app)
        document.querySelector('#modal-delete-btn').addEventListener('click', () => {
            document.querySelector('#modal-overlay').classList.add('d-none')
            document.querySelector('#error-modal').classList.add('d-none')
            location.reload()
        })
    }

    /**
     * Generage message for item not found by name
     * @method
     * @static
     * @param {string} type
     */
    static notFound(type) {
        const message = `invalid request - ${type} not found`
        this.#logMessage(message)
    }

    /**
     * Generate message for item not valid
     * instance of specific class
     * @method
     * @static
     * @param {string} type
     */
    static invalidInstance(type) {
        const message = `invalid ${type} instance`
        this.#logMessage(message)
    }

    /**
     * Generate message for instance not valid
     * configuration
     * @method
     * @static
     * @param {string} type
     */
    static invalidConfig(type) {
        const message = `invalid ${type} configuration`
        this.#logMessage(message)
    }

    /**
     * Generate message for item not operable
     * @method
     * @static
     * @param {string} item
     */
    static notOperable(item) {
        const message = `${item} is not operable`
        this.#logMessage(message)
    }

    /**
     * Generate message for value equal to current
     * @method
     * @static
     * @param {string} value
     */
    static noChange(value) {
        const message = `new ${value} is equal to current value`
        this.#logMessage(message)
    }

    /**
     * Generate message for one item does not have
     * another item
     * @method
     * @static
     * @param {string} item
     */
    static doesNotHave(item1, item2) {
        const message = `${item1} does not have ${item2}`
        this.#logMessage(message)
    }

    /**
     * Generate message for action not allowed upon
     * item under certain condition
     * @method
     * @static
     * @param {string} item
     * @param {string} action
     * @param {string} condition
     */
    static cannotWhile(item, action, condition) {
        const message = `${item} cannot be ${action} while ${condition}`
        this.#openErrorModal(message)
    }

    /**
     * Generate message for condition must be
     * met for item action to be allowed
     * @method
     * @static
     * @param {string} item
     * @param {string} condition
     * @param {string} action
     */
    static mustBe(item, condition, action) {
        const message = `${item} must be ${condition} to ${action}`
        this.#openErrorModal(message)
    }

    /**
     * Generate message for item change not
     * valid based on another item
     * @param {string} item1
     * @param {string} item2
     */
    static notValid(item1, item2) {
        const message = `new ${item1} not valid for current ${item2}`
        this.#logMessage(message)
    }

    /**
     * Generage message for one item updated
     * based on another item changing
     * @method
     * @static
     * @param {string} item1
     * @param {string} item2
     */
    static updated(item1, newitem1, item2) {
        const message = `${item1} updated to ${newitem1} for new ${item2}`
        this.#logMessage(message)
    }

    /**
     * Generate warning message
     * @method
     * @static
     * @param {string} message
     */
    static warning(message) {
        this.#openErrorModal(message, 'Delete')
    }

    /**
     * Generate custom message to be logged
     * @method
     * @static
     * @param {string} message
     */
    static customLogOnly(message) {
        this.#logMessage(message)
    }

    /**
     * Generate custom message to open modal
     * @method
     * @static
     * @param {string} message
     */
    static customModal(message) {
        this.#openErrorModal(message)
    }
}
