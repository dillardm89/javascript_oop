import { HTMLFunctions } from '../utils/HTMLFunctions.js'
import { ChassisConfig } from '../configs/ChassisConfig.js'
import { ChassisBuilder } from './ChassisBuilder.js'
import { ErrorMessage } from '../utils/ErrorMessage.js'

/**
 * Represents an interactive seats builder
 * @class
 */
export class SeatsBuilder {
    /** Creates a new seats builder */
    constructor() {
        this.seatsDiv = document.querySelector('#seats-div')
        this.seatsBtn = null
        this.builderDiv = null
        this.countDiv = null
        this.detailsDiv = null
        this.countSlider = null
        this.countSliderLabel = null
        this.seatCount = 0
        this.chassis = null
        this.seats = []
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
        this.seatsBtn = document.querySelector('#seats-button')
        this.builderDiv = document.querySelector('#seats-builder')
        this.countDiv = this.builderDiv.querySelector('#seats-count-select')
        this.detailsDiv = this.builderDiv.querySelector('#seats-details-select')
        this.#seatsEventListeners()
    }

    /**
     * Add event listeners to display seats builder
     * @method
     * @private
     */
    #seatsEventListeners() {
        this.seatsBtn.addEventListener('click', () => {
            if (!this.#getVehicleType()) { return }
            document.querySelector('#save-windows-button').click()

            document.querySelector('#seats-div').classList.remove('d-none')
            document.querySelector('#create-button').classList.remove('d-none')
            document.querySelector('#back-windows-button').classList.remove('d-none')
            document.querySelector('#windows-div').classList.add('readonly-overlay')
            this.seatsBtn.classList.add('d-none')

            this.#insertCountHTML()
            this.#insertSeatDetailsHTML()
            window.scrollTo({ top: this.seatsDiv.offsetTop, behavior: 'smooth' })
        })
    }

    /**
     * Insert html for seat count selector options dynamically based on vehicle type selected
     * @method
     * @private
     */
    #insertCountHTML() {
        const vehicleType = this.#getVehicleType()
        const allowedCounts = ChassisConfig.getAllowedNumberSeats(vehicleType)
        const countHTML = `<div class="col-4"><div class="card form-label"><p class="m-0 pb-0 card-body">Select Number of Seats:</p><p class="m-0 text-muted small">(changes will reset seat details)</p></div></div><div class="col-8 seat-count"><div class="card seat-count-div"><input type="range" id="count-slider" min="${allowedCounts[0]}" max="${allowedCounts[1]}" step="1" value="${allowedCounts[0]}" class="card-body mx-3" /><div class="row" id="count-slider-label"><span class="col-2">${allowedCounts[0]}</span><span class="col-8"><span>Current: </span><span id='count-slider-value'>${allowedCounts[0]}</span></span><span class="col-2">${allowedCounts[1]}</span></div></div></div>`

        this.seatCount = allowedCounts[0]
        this.countDiv.innerHTML = countHTML
        this.countSlider = this.countDiv.querySelector('#count-slider')
        this.countSliderLabel = this.countDiv.querySelector('#count-slider-value')
        this.#countEventListeners()
    }

    /**
     * Add event listeners for seat count selection
     * @method
     * @private
     */
    #countEventListeners() {
        this.countSlider.addEventListener('input', () => {
            this.countSliderLabel.textContent = this.countSlider.value
            this.seatCount = this.countSlider.value
            this.seats = []
            this.#insertSeatDetailsHTML()
        })
    }

    /**
     * Insert html for seat details options dynamically based on window count selected
     * @method
     * @private
     */
    #insertSeatDetailsHTML() {
        HTMLFunctions.fetchDynamicHtmlString('builder/components/seat-details.html', (contentString) => {
            const startString = '<div class="d-flex flex-wrap justify-content-end" id="seat-detail-cards">'
            const endString = '</div>'
            let innerString = ''
            for (let i = 0; i < this.seatCount; i++) {
                innerString += `<div class="card p-2 seat-details" id = "${i}" >${contentString}</div>`
            }
            const detailHTML = startString + innerString + endString
            this.detailsDiv.innerHTML = detailHTML
            this.detailsDiv.querySelectorAll('.seat-details').forEach(seat => {
                const seatNumber = parseInt(seat.id, 10) + 1
                seat.querySelector('#seat-name').value = `seat-${seatNumber}`
            })
            this.#doorDetailsEventListeners()
        })
    }

    /**
     * Add event listeners for seat details selection
     * @method
     * @private
     */
    #doorDetailsEventListeners() {
        document.querySelector('#save-seats-button').addEventListener('click', () => {
            this.seats = []
            this.builderDiv.querySelectorAll('.seat-details').forEach(seat => {
                const seatNumber = parseInt(seat.id, 10) + 1
                let name = seat.querySelector('#seat-name').value
                if (name.trim() == '') { name = `seat-${seatNumber}` }

                for (const seat of this.seats) {
                    if (name == seat.name) {
                        name += '(2)'
                        break
                    }
                }

                const material = seat.querySelector('#seat-material').value
                const color = seat.querySelector('#seat-color').value
                const operationType = seat.querySelector('#operation-type').value
                const hasHeat = seat.querySelector('#has-heat').checked
                const hasCool = seat.querySelector('#has-cool').checked
                this.#constructSeatsArray(name, material, color, operationType, hasHeat, hasCool)
            })
        })
    }

    /**
     * Create seat object and push to seats array based on user selections
     * @method
     * @private
     * @param {string} name
     * @param {string} material
     * @param {string} color
     * @param {string} operationType
     * @param {boolean} hasHeat
     * @param {boolean} hasCool
     */
    #constructSeatsArray(name, material, color, operationType, hasHeat, hasCool) {
        const seat = {
            name, material, color,
            isOperable: operationType == 'none' ? false : true,
            operationType, hasHeat, hasCool
        }
        this.seats.push(seat)
    }

    /**
     * Get seats array
     * @method
     * @returns {object[]}
     */
    getSeatsArray() { return this.seats }
}
