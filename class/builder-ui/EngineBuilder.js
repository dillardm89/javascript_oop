import { EngineConfig } from '../configs/EngineConfig.js'
import { ChassisBuilder } from './ChassisBuilder.js'
import { ErrorMessage } from '../utils/ErrorMessage.js'

/**
 * Represents an interactive enginee builder
 * @class
 */
export class EngineBuilder {
    /** Creates a new engine builder */
    constructor() {
        this.engineDiv = document.querySelector('#engine-div')
        this.engineBtn = null
        this.builderDiv = null
        this.fuelDiv = null
        this.sizeDiv = null
        this.slider = null
        this.sliderValueLabel = null
        this.transmission = 'automatic'
        this.fuel = 'gasoline'
        this.size = null
        this.chassis = null
        this.engine = null
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
        this.engineBtn = document.querySelector('#engine-button')
        this.builderDiv = document.querySelector('#engine-builder')
        this.fuelDiv = this.builderDiv.querySelector('#fuel-select')
        this.sizeDiv = this.builderDiv.querySelector('#engine-size-select')
        this.#engineEventListeners()
        this.#transmissionEventListeners()
    }

    /**
     * Add event listeners to display engine builder, handle back engine button, and save engine button
     * @method
     * @private
     */
    #engineEventListeners() {
        // Event listener for next engine button
        this.engineBtn.addEventListener('click', () => {
            if (!this.#getVehicleType()) { return }
            document.querySelector('#save-chassis-button').click()

            document.querySelector('#engine-div').classList.remove('d-none')
            document.querySelector('#tires-button').classList.remove('d-none')
            document.querySelector('#back-chassis-button').classList.remove('d-none')
            document.querySelector('#chassis-div').classList.add('readonly-overlay')
            this.engineBtn.classList.add('d-none')

            this.#insertFuelHTML(this.transmission)
            this.#insertSizeHTML(this.fuel)
            window.scrollTo({ top: this.engineDiv.offsetTop, behavior: 'smooth' })
        })

        // Event listener for back engine button
        document.querySelector('#back-engine-button').addEventListener('click', () => {
            document.querySelector('#tires-div').classList.add('d-none')
            document.querySelector('#doors-button').classList.add('d-none')
            document.querySelector('#engine-div').classList.remove('readonly-overlay')
            document.querySelector('#tires-button').classList.remove('d-none')
            document.querySelector('#back-engine-button').classList.add('d-none')
            window.scrollTo({ top: this.engineDiv.offsetTop, behavior: 'smooth' })
        })

        // Event listener for save engine button
        document.querySelector('#save-engine-button').addEventListener('click', () => {
            this.engine = {
                vehicleType: this.#getVehicleType(),
                fuel: this.fuel,
                size: this.size,
                transmission: this.transmission
            }
        })
    }

    /**
     * Add event listeners for transmission selection
     * @method
     * @private
     */
    #transmissionEventListeners() {
        this.builderDiv.querySelectorAll('.transmission-type').forEach(button => {
            button.addEventListener('click', (event) => {
                this.transmission = event.currentTarget.id
                this.builderDiv.querySelectorAll('.transmission-div').forEach(item => { item.classList.remove('active') })
                button.firstElementChild.classList.add('active')
                this.#insertFuelHTML(this.transmission)
            })
        })
    }

    /**
     * Insert html for fuel selector options dynamically based on transmission selected
     * @method
     * @private
     * @param {string} selectedTransmission
     */
    #insertFuelHTML(selectedTransmission) {
        const allowedFuels = EngineConfig.getAllowedEngineFuels(selectedTransmission)
        let fuelHTML = '<div class="col-4"><div class="card form-label"><p class="m-0 card-body">Select Fuel Type:</p></div></div>'
        for (const fuel of allowedFuels) {
            const upperString = fuel.charAt(0).toUpperCase() + fuel.slice(1)
            let stringStart = ''
            if (selectedTransmission == 'manual') { stringStart = '<div class="col-4 fuel-type" ' }
            else { stringStart = '<div class="col-2 fuel-type" ' }

            const fuelString = stringStart + `id="${fuel}"><div class="card fuel-div"><p class="m-0 card-body">${upperString}</p></div></div>`
            fuelHTML += fuelString
        }

        this.fuelDiv.innerHTML = fuelHTML
        this.fuelDiv.querySelector('#gasoline').firstElementChild.classList.add('active')
        this.#fuelEventListeners()
    }

    /**
     * Add event listeners for fuel selection
     * @method
     * @private
     */
    #fuelEventListeners() {
        this.builderDiv.querySelectorAll('.fuel-type').forEach(button => {
            button.addEventListener('click', (event) => {
                this.fuel = event.currentTarget.id
                this.builderDiv.querySelectorAll('.fuel-div').forEach(item => { item.classList.remove('active') })
                button.firstElementChild.classList.add('active')
                this.#insertSizeHTML(this.fuel)
            })
        })
    }

    /**
     * Insert html for engine size selector options dynamically based on vehicle and fuel types selected
     * @method
     * @private
     * @param {string} selectedFuel
     */
    #insertSizeHTML(selectedFuel) {
        const vehicleType = this.#getVehicleType()
        const allowedSizes = EngineConfig.getAllowedEngineSizes(vehicleType, selectedFuel)
        const minLabel = selectedFuel == 'electric' ? `${allowedSizes[0]}kWh` : `${allowedSizes[0].toFixed(1)}L`
        const maxLabel = selectedFuel == 'electric' ? `${allowedSizes[1]}kWh` : `${allowedSizes[1].toFixed(1)}L`
        const sizeStep = selectedFuel == 'electric' ? 5 : 0.1
        const sizeHTML = `<div class="col-4"><div class="card form-label"><p class="m-0 card-body">Select Engine Size:</p></div></div><div class="col-8 engine-size"><div class="card engine-size-div"><input type="range" id="size-slider" min="${allowedSizes[0]}" max="${allowedSizes[1]}" step="${sizeStep}" value="${allowedSizes[0]}" class="card-body mx-3" /><div class="row" id="slider-label"><span class="col-2">${minLabel}</span><span class="col-8"><span>Current: </span><span id='slider-value'>${allowedSizes[0]}</span><span>${selectedFuel == 'electric' ? 'kWh' : 'L'}</span></span><span class="col-2">${maxLabel}</span></div></div></div>`

        this.sizeDiv.innerHTML = sizeHTML
        this.slider = this.sizeDiv.querySelector('#size-slider')
        this.sliderValueLabel = this.sizeDiv.querySelector('#slider-value')
        this.size = allowedSizes[0]
        this.#sizeEventListeners()
    }


    /**
     * Add event Listeners for engine size selection
     * @method
     * @private
     */
    #sizeEventListeners() {
        this.slider.addEventListener('input', () => {
            this.sliderValueLabel.textContent = this.slider.value
            this.size = this.slider.value
        })
    }

    /**
     * Get engine object based on user selections
     * @method
     * @returns {object | null}
     */
    getEngine() {
        if (!this.engine) { return ErrorMessage.customLogOnly('no engine created yet') }
        return this.engine
    }
}
