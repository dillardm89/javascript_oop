import { ErrorMessage } from '../utils/ErrorMessage.js'

/**
 * Represents an interactive chassis builder
 * @class
 */
export class ChassisBuilder {
    /** Creates a new chassis builder */
    constructor() {
        this.chassisDiv = document.querySelector('#chassis-div')
        this.builderDiv = null
        this.vehicleType = 'car'
        this.chassis = null
        this.#startEventListeners()
    }

    /**
     * Set vehicle type
     * @method
     * @private
     * @param {string} newType
     */
    #setVehicleType(newType) { this.vehicleType = newType }

    /**
     * Get vehicle type
     * @method
     * @returns {string}
     */
    getVehicleType() { return this.vehicleType }

    /**
     * Start event listeners once DOM content loaded
     * @method
     * @private
     */
    #startEventListeners() {
        this.builderDiv = document.querySelector('#chassis-builder')
        this.#chassisEventListeners()
        this.#saveChassisEventListeners()
        this.#eventListeners()
    }

    /**
     * Add event listeners for chassis selection
     * @method
     * @private
     */
    #chassisEventListeners() {
        this.builderDiv.querySelectorAll('.vehicle-type').forEach(button => {
            button.addEventListener('click', (event) => {
                const buttonId = event.currentTarget.id
                this.#setVehicleType(buttonId)
                this.builderDiv.querySelectorAll('.vehicle-li').forEach(item => { item.classList.remove('active') })
                button.firstElementChild.classList.add('active')
            })
        })
    }

    /**
     * Add event listeners for chassis save button
     * @method
     * @private
     */
    #saveChassisEventListeners() {
        document.querySelector('#save-chassis-button').addEventListener('click', () => {
            let year = this.chassisDiv.querySelector('#vehicle-year').value
            if (year.trim() == '') { year = '2024' }

            let make = this.chassisDiv.querySelector('#vehicle-make').value
            if (make.trim() == '') { make = 'Honda' } else { make = make.charAt(0).toUpperCase() + make.slice(1) }

            let model = this.chassisDiv.querySelector('#vehicle-model').value
            if (model.trim() == '') { model = 'Accord' } else { model = model.charAt(0).toUpperCase() + model.slice(1) }

            let color = this.chassisDiv.querySelector('#vehicle-color').value
            if (color.trim() == '') { color = 'White' } else { color = color.charAt(0).toUpperCase() + color.slice(1) }

            this.chassis = { year, make, model, color, type: this.vehicleType }
        })
    }

    /**
     * Add event listeners for back chassis button
     * @method
     * @private
     */
    #eventListeners() {
        document.querySelector('#back-chassis-button').addEventListener('click', () => {
            document.querySelector('#engine-div').classList.add('d-none')
            document.querySelector('#tires-button').classList.add('d-none')
            document.querySelector('#chassis-div').classList.remove('readonly-overlay')
            document.querySelector('#engine-button').classList.remove('d-none')
            document.querySelector('#back-chassis-button').classList.add('d-none')
            window.scrollTo({ top: this.chassisDiv.offsetTop, behavior: 'smooth' })
        })
    }

    /**
     * Get chassis object based on user selections
     * @method
     * @returns {object | null}
     */
    getChassis() {
        if (!this.chassis) { return ErrorMessage.customLogOnly('no chassis created yet') }
        return this.chassis
    }
}
