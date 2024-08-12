import { HTMLFunctions } from '../utils/HTMLFunctions.js'
import { ErrorMessage } from '../utils/ErrorMessage.js'
import { ChassisConfig } from '../configs/ChassisConfig.js'
import { ChassisBuilder } from './ChassisBuilder.js'

/**
 * Represents an interactive doors builder
 * @class
 */
export class DoorsBuilder {
    /** Creates a new doors builder */
    constructor() {
        this.doorsDiv = document.querySelector('#doors-div')
        this.doorsBtn = null
        this.builderDiv = null
        this.countDiv = null
        this.detailsDiv = null
        this.countSlider = null
        this.countSliderLabel = null
        this.doorCount = 0
        this.windowNames = []
        this.chassis = null
        this.doors = []
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
     * Get array of window names
     * @method
     * @returns {string[]}
     */
    getWindowNames() {
        this.windowNames = []
        for (const door of this.doors) { if (door.hasWindow) { this.windowNames.push(door.name) } }
        return this.windowNames
    }

    /**
     * Check valid door count for vehicle type
     * @method
     * @returns {boolean}
     */
    checkValidDoorCount() {
        if (this.#getVehicleType() != 'motorcycle' && this.doorCount == 0) { return false }
        return true
    }

    /**
     * Start event listeners once DOM content loaded
     * @method
     * @private
     */
    #startEventListeners() {
        this.doorsBtn = document.querySelector('#doors-button')
        this.builderDiv = document.querySelector('#doors-builder')
        this.countDiv = this.builderDiv.querySelector('#doors-count-select')
        this.detailsDiv = this.builderDiv.querySelector('#doors-details-select')
        this.#doorsEventListeners()
    }

    /**
     * Add event listener to display doors builder and handle back doors button
     * @method
     * @private
     */
    #doorsEventListeners() {
        // Event listener for next doors button
        this.doorsBtn.addEventListener('click', () => {
            if (!this.#getVehicleType()) { return }
            document.querySelector('#save-tires-button').click()

            document.querySelector('#doors-div').classList.remove('d-none')
            document.querySelector('#windows-button').classList.remove('d-none')
            document.querySelector('#back-tires-button').classList.remove('d-none')
            document.querySelector('#tires-div').classList.add('readonly-overlay')
            this.doorsBtn.classList.add('d-none')

            this.#insertCountHTML()
            this.#insertDoorDetailsHTML()
            window.scrollTo({ top: this.doorsDiv.offsetTop, behavior: 'smooth' })
        })

        // Event listener for back doors button
        document.querySelector('#back-doors-button').addEventListener('click', () => {
            document.querySelector('#windows-div').classList.add('d-none')
            document.querySelector('#seats-button').classList.add('d-none')
            document.querySelector('#doors-div').classList.remove('readonly-overlay')
            document.querySelector('#windows-button').classList.remove('d-none')
            document.querySelector('#back-doors-button').classList.add('d-none')
            window.scrollTo({ top: this.doorsDiv.offsetTop, behavior: 'smooth' })
        })
    }

    /**
     * Insert html for door count selector options dynamically based on vehicle type selected
     * @method
     * @private
     */
    #insertCountHTML() {
        const vehicleType = this.#getVehicleType()
        const allowedCounts = ChassisConfig.getAllowedNumberDoors(vehicleType)
        const startString = '<div class="col-4"><div class="card form-label"><p class="m-0 pb-0 card-body">Select Number of Doors:</p>'

        if (vehicleType == 'motorcycle') {
            const countHTML = startString + '</div></div><div class="col-8 door-count"><div class="card door-count-div"><p class="m-0 card-body">Motorcyles do not have doors</p></div></div>'
            this.countDiv.innerHTML = countHTML
        } else {
            const countHTML = startString + `<p class="m-0 text-muted small">(changes will reset door details)</p></div></div><div class="col-8 door-count"><div class="card door-count-div"><input type="range" id="count-slider" min="${allowedCounts[0]}" max="${allowedCounts[1]}" step="1" value="${allowedCounts[0]}" class="card-body mx-3" /><div class="row" id="count-slider-label"><span class="col-2">${allowedCounts[0]}</span><span class="col-8"><span>Current: </span><span id='count-slider-value'>${allowedCounts[0]}</span></span><span class="col-2">${allowedCounts[1]}</span></div></div></div>`

            this.doorCount = allowedCounts[0]
            this.countDiv.innerHTML = countHTML
            this.countSlider = this.countDiv.querySelector('#count-slider')
            this.countSliderLabel = this.countDiv.querySelector('#count-slider-value')
        }
        this.#countEventListeners()
    }

    /**
     * Add event listeners for door count selection
     * @method
     * @private
     */
    #countEventListeners() {
        this.countSlider.addEventListener('input', () => {
            this.countSliderLabel.textContent = this.countSlider.value
            this.doorCount = this.countSlider.value
            this.doors = []
            this.windowNames = []
            this.#insertDoorDetailsHTML()
        })
    }

    /**
     * Insert html for door details options dynamically based on door count selected
     * @method
     * @private
     */
    #insertDoorDetailsHTML() {
        HTMLFunctions.fetchDynamicHtmlString('builder/components/door-details.html', (contentString) => {
            const startString = '<div class="d-flex flex-wrap justify-content-end" id="door-detail-cards">'
            const endString = '</div>'
            let innerString = ''
            for (let i = 0; i < this.doorCount; i++) { innerString += `<div class="card p-2 door-details" id = "${i}" >${contentString}</div>` }

            const detailHTML = startString + innerString + endString
            this.detailsDiv.innerHTML = detailHTML
            this.detailsDiv.querySelectorAll('.door-details').forEach(door => {
                const doorNumber = parseInt(door.id, 10) + 1
                door.querySelector('#door-name').value = `door-${doorNumber}`
            })
            this.#doorDetailsEventListeners()
        })
    }

    /**
     * Add event listeners for door details selection
     * @method
     * @private
     */
    #doorDetailsEventListeners() {
        document.querySelector('#save-doors-button').addEventListener('click', () => {
            this.doors = []
            this.windowNames = []
            this.builderDiv.querySelectorAll('.door-details').forEach(door => {
                const doorNumber = parseInt(door.id, 10) + 1
                let name = door.querySelector('#door-name').value
                if (name.trim() == '') { name = `door-${doorNumber}` }

                for (const door of this.doors) {
                    if (name == door.name) {
                        name += '(2)'
                        break
                    }
                }

                const hasWindow = door.querySelector('#has-window').checked
                const hingeType = door.querySelector('#hinge-type').value
                this.#constructDoorsArray(name, hasWindow, hingeType)
            })
        })
    }

    /**
     * Create door object and push to doors array based on user selections
     * @method
     * @private
     * @param {string} name
     * @param {boolean} hasWindow
     * @param {string} hingeType
     */
    #constructDoorsArray(name, hasWindow, hingeType) {
        const door = { name, hasWindow, hingeType }
        this.doors.push(door)
    }

    /**
     * Get doors array
     * @method
     * @returns {object[] | null}
     */
    getDoorsArray() {
        if (this.doorCount == 0) { return ErrorMessage.customLogOnly('motorcycles do not have doors') }
        return this.doors
    }
}
