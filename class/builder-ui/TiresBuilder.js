import { TiresConfig } from '../configs/TiresConfig.js'
import { ChassisBuilder } from './ChassisBuilder.js'
import { ErrorMessage } from '../utils/ErrorMessage.js'

/**
 * Represents an interactive tires builder
 * @class
 */
export class TiresBuilder {
    /** Creates a new tires builder */
    constructor() {
        this.tiresDiv = document.querySelector('#tires-div')
        this.tiresBtn = null
        this.builderDiv = null
        this.countDiv = null
        this.sizeDiv = null
        this.pressureDiv = null
        this.sizeSlider = null
        this.sizeSliderLabel = null
        this.pressureSlider = null
        this.pressureSliderLabel = null
        this.count = null
        this.size = null
        this.pressure = null
        this.chassis = null
        this.tires = null
        this.#startEventListeners()
    }

    /**
     * Set chassis builder instance
     * @method
     * @param {string} newChassis
     */
    setChassisBuilder(newChassis) {
        if (newChassis instanceof ChassisBuilder) { this.chassis = newChassis }
        else { ErrorMessage.invalidInstance('chassis builder') }
    }

    /**
     * Get chassis vehicle type
     * @method
     * @private
     * @returns {string | undefined}
     */
    #getVehicleType() { return this.chassis ? this.chassis.getVehicleType() : undefined }

    /**
     * Start event listeners once DOM content loaded
     * @method
     * @private
     */
    #startEventListeners() {
        this.tiresBtn = document.querySelector('#tires-button')
        this.builderDiv = document.querySelector('#tires-builder')
        this.countDiv = this.builderDiv.querySelector('#tire-count-select')
        this.sizeDiv = this.builderDiv.querySelector('#tire-size-select')
        this.pressureDiv = this.builderDiv.querySelector('#tire-pressure-select')
        this.#tiresEventListeners()
    }

    /**
    * Add event listener to display tire builder, handle back tires button, and save tires button
    * @method
    * @private
    */
    #tiresEventListeners() {
        // Event listener for next tires button
        this.tiresBtn.addEventListener('click', () => {
            if (!this.#getVehicleType()) { return }
            document.querySelector('#save-engine-button').click()

            document.querySelector('#tires-div').classList.remove('d-none')
            document.querySelector('#doors-button').classList.remove('d-none')
            document.querySelector('#back-engine-button').classList.remove('d-none')
            document.querySelector('#engine-div').classList.add('readonly-overlay')
            this.tiresBtn.classList.add('d-none')

            this.#insertCountHTML()
            this.#insertSizeHTML()
            this.#insertPressureHTML()
            window.scrollTo({ top: this.tiresDiv.offsetTop, behavior: 'smooth' })
        })

        // Event listener for back tires button
        document.querySelector('#back-tires-button').addEventListener('click', () => {
            document.querySelector('#doors-div').classList.add('d-none')
            document.querySelector('#windows-button').classList.add('d-none')
            document.querySelector('#tires-div').classList.remove('readonly-overlay')
            document.querySelector('#doors-button').classList.remove('d-none')
            document.querySelector('#back-tires-button').classList.add('d-none')
            window.scrollTo({ top: this.tiresDiv.offsetTop, behavior: 'smooth' })
        })

        // Event listener for save tires button
        document.querySelector('#save-tires-button').addEventListener('click', () => {
            this.tires = {
                vehicleType: this.#getVehicleType(),
                number: this.count,
                size: this.size,
                pressure: this.pressure
            }
        })
    }

    /**
     * Insert html for tire count selector options dynamically based on vehicle type selected
     * @method
     * @private
     */
    #insertCountHTML() {
        const vehicleType = this.#getVehicleType()
        const allowedCounts = TiresConfig.getAllowedNumberTires(vehicleType)
        const colWidth = 8 / allowedCounts.length
        const minCountString = allowedCounts[0].toString()
        let minCountEscapeString = `#\\3${minCountString.charAt(0)}`
        if (minCountString.length > 1) {
            const tailString = minCountString.slice(1)
            minCountEscapeString = minCountEscapeString + ' ' + tailString
        }

        let countHTML = '<div class="col-4"><div class="card form-label"><p class="m-0 card-body">Select Number of Tires:</p></div></div>'
        for (const count of allowedCounts) {
            countHTML += `<div class="col-${colWidth} tire-count" id="${count}"><div class="card tire-count-div"><p class="m-0 card-body">${count}</p></div></div>`
        }

        this.countDiv.innerHTML = countHTML
        this.countDiv.querySelector(minCountEscapeString).firstElementChild.classList.add('active')
        this.count = allowedCounts[0]
        this.#countEventListeners(allowedCounts.length)
    }

    /**
     * Add event listeners for tire count selection
     * optionsCount param determines default button selection
     * @method
     * @private
     * @param {number} optionsCount
     */
    #countEventListeners(optionsCount) {
        if (optionsCount == 1) { return }

        this.builderDiv.querySelectorAll('.tire-count').forEach(button => {
            button.addEventListener('click', (event) => {
                this.count = parseInt(event.currentTarget.id, 10)
                this.builderDiv.querySelectorAll('.tire-count-div').forEach(item => { item.classList.remove('active') })
                button.firstElementChild.classList.add('active')
            })
        })
    }

    /**
     * Insert html for tire size selector options dynamically based on vehicle type selected
     * @method
     * @private
     */
    #insertSizeHTML() {
        const vehicleType = this.#getVehicleType()
        const allowedSizes = TiresConfig.getAllowedTireSizes(vehicleType)
        const minLabel = `${allowedSizes[0]}in`
        const maxLabel = `${allowedSizes[1]}in`
        const sizeHTML = `<div class="col-4"><div class="card form-label"><p class="m-0 card-body">Select Tire Size:</p></div></div><div class="col-8 tire-size"><div class="card tire-size-div"><input type="range" id="size-slider" min="${allowedSizes[0]}" max="${allowedSizes[1]}" step="1" value="${allowedSizes[0]}" class="card-body mx-3" /><div class="row" id="size-slider-label"><span class="col-2">${minLabel}</span><span class="col-8"><span>Current: </span><span id='size-slider-value'>${allowedSizes[0]}</span><span> inches</span></span><span class="col-2">${maxLabel}</span></div></div></div>`

        this.sizeDiv.innerHTML = sizeHTML
        this.sizeSlider = this.sizeDiv.querySelector('#size-slider')
        this.sizeSliderLabel = this.sizeDiv.querySelector('#size-slider-value')
        this.size = allowedSizes[0]
        this.#sizeEventListeners()
    }

    /**
     * Add event listeners for tire size selection
     * @method
     * @private
     */
    #sizeEventListeners() {
        this.sizeSlider.addEventListener('input', () => {
            this.sizeSliderLabel.textContent = this.sizeSlider.value
            this.size = this.sizeSlider.value
        })
    }

    /**
     * Insert html for tire pressure selector options dynamically based on vehicle type selected
     * @method
     * @private
     */
    #insertPressureHTML() {
        const vehicleType = this.#getVehicleType()
        const allowedPressures = TiresConfig.getAllowedTirePressure(vehicleType)
        const minLabel = `${allowedPressures[0]}psi`
        const maxLabel = `${allowedPressures[1]}psi`
        const pressureHTML = `<div class="col-4"><div class="card form-label"><p class="m-0 card-body">Select Tire Pressure:</p></div></div><div class="col-8 tire-pressure"><div class="card tire-pressure-div"><input type="range" id="pressure-slider" min="${allowedPressures[0]}" max="${allowedPressures[1]}" step="1" value="${allowedPressures[0]}" class="card-body mx-3" /><div class="row" id="pressure-slider-label"><span class="col-2">${minLabel}</span><span class="col-8"><span>Current: </span><span id='pressure-slider-value'>${allowedPressures[0]}</span><span> psi</span></span><span class="col-2">${maxLabel}</span></div></div></div>`

        this.pressureDiv.innerHTML = pressureHTML
        this.pressureSlider = this.pressureDiv.querySelector('#pressure-slider')
        this.pressureSliderLabel = this.pressureDiv.querySelector('#pressure-slider-value')
        this.pressure = allowedPressures[0]
        this.#pressureEventListeners()
    }

    /**
    * Add event listeners for tire pressure selection
    * @method
    * @private
    */
    #pressureEventListeners() {
        this.pressureSlider.addEventListener('input', () => {
            this.pressureSliderLabel.textContent = this.pressureSlider.value
            this.pressure = this.pressureSlider.value
        })
    }

    /**
     * Get tires object based on user selections
     * @method
     * @returns {object | null}
     */
    getTires() {
        if (!this.tires) { return ErrorMessage.customLogOnly('no tires created yet') }
        return this.tires
    }
}
