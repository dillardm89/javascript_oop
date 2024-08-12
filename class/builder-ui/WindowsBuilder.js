import { HTMLFunctions } from '../utils/HTMLFunctions.js'
import { ChassisBuilder } from './ChassisBuilder.js'
import { ChassisConfig } from '../configs/ChassisConfig.js'
import { DoorsBuilder } from './DoorsBuilder.js'
import { ErrorMessage } from '../utils/ErrorMessage.js'

/**
 * Represents an interactive windows builder
 * @class
 */
export class WindowsBuilder {
    /** Creates a new windows builder */
    constructor() {
        this.windowsDiv = document.querySelector('#windows-div')
        this.windowsBtn = null
        this.builderDiv = null
        this.countDiv = null
        this.detailsDiv = null
        this.countSlider = null
        this.countSliderLabel = null
        this.windowCount = 0
        this.doorsWindowCount = null
        this.chassis = null
        this.doors = null
        this.windows = []
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
     * Set doors builder instance
     * @method
     * @param {string} newDoors
     */
    setDoorsBuilder(newDoors) {
        if (newDoors instanceof DoorsBuilder) { this.doors = newDoors }
        else { ErrorMessage.invalidInstance('doors builder') }
    }

    /**
     * Start event listeners once DOM content loaded
     * @method
     * @private
     */
    #startEventListeners() {
        this.windowsBtn = document.querySelector('#windows-button')
        this.builderDiv = document.querySelector('#windows-builder')
        this.countDiv = this.builderDiv.querySelector('#windows-count-select')
        this.detailsDiv = this.builderDiv.querySelector('#windows-details-select')
        this.#windowsEventListeners()
    }

    /**
     * Add event listeners to display windows builder and handle back windows button
     * @method
     * @private
     */
    #windowsEventListeners() {
        // Event listener for next windows button
        this.windowsBtn.addEventListener('click', () => {
            if (!this.#getVehicleType() || !this.doors.checkValidDoorCount()) { return }
            document.querySelector('#save-doors-button').click()

            document.querySelector('#windows-div').classList.remove('d-none')
            document.querySelector('#seats-button').classList.remove('d-none')
            document.querySelector('#back-doors-button').classList.remove('d-none')
            document.querySelector('#doors-div').classList.add('readonly-overlay')
            this.windowsBtn.classList.add('d-none')

            this.#insertCountHTML()
            this.#insertWindowDetailsHTML()
            window.scrollTo({ top: this.windowsDiv.offsetTop, behavior: 'smooth' })
        })

        // Event listener for back windows button
        document.querySelector('#back-windows-button').addEventListener('click', () => {
            document.querySelector('#seats-div').classList.add('d-none')
            document.querySelector('#create-button').classList.add('d-none')
            document.querySelector('#windows-div').classList.remove('readonly-overlay')
            document.querySelector('#seats-button').classList.remove('d-none')
            document.querySelector('#back-windows-button').classList.add('d-none')
            window.scrollTo({ top: this.windowsDiv.offsetTop, behavior: 'smooth' })
        })
    }

    /**
     * Insert html for window count selector options dynamically based on vehicle type selected
     * @method
     * @private
     */
    #insertCountHTML() {
        const vehicleType = this.#getVehicleType()
        const doorWindows = this.doors.getWindowNames()
        const allowedCounts = ChassisConfig.getAllowedNumberWindows(vehicleType)
        const startString = '<div class="col-4"><div class="card form-label"><p class="m-0 pb-0 card-body">Select Number of Windows:</p>'
        const minWindowCount = allowedCounts[0] > doorWindows.length ? allowedCounts[0] : doorWindows.length

        if (vehicleType == 'motorcycle') {
            const countHTML = startString + '</div></div><div class="col-8 window-count"><div class="card window-count-div"><p class="m-0 card-body">Motorcyles do not have windows</p></div></div>'
            this.countDiv.innerHTML = countHTML
        } else {
            const countHTML = startString + `<p class="m-0 text-muted small">(changes will reset window details)</p></div></div><div class="col-8 window-count"><div class="card window-count-div"><input type="range" id="count-slider" min="${minWindowCount}" max="${allowedCounts[1]}" step="1" value="${minWindowCount}" class="card-body mx-3" /><div class="row" id="count-slider-label"><span class="col-2">${minWindowCount}</span><span class="col-8"><span>Current: </span><span id='count-slider-value'>${minWindowCount}</span></span><span class="col-2">${allowedCounts[1]}</span></div></div></div>`

            this.windowCount = minWindowCount
            this.countDiv.innerHTML = countHTML
            this.countSlider = this.countDiv.querySelector('#count-slider')
            this.countSliderLabel = this.countDiv.querySelector('#count-slider-value')
        }
        this.#countEventListeners()
    }

    /**
     * Add event listeners for window count selection
     * @method
     * @private
     */
    #countEventListeners() {
        this.countSlider.addEventListener('input', () => {
            this.countSliderLabel.textContent = this.countSlider.value
            this.windowCount = this.countSlider.value
            this.windows = []
            this.#insertWindowDetailsHTML()
        })
    }

    /**
     * Insert html for window details options dynamically based on window count selected
     * @method
     * @private
     */
    #insertWindowDetailsHTML() {
        HTMLFunctions.fetchDynamicHtmlString('builder/components/window-details.html', (contentString) => {
            const doorWindows = this.doors.getWindowNames()
            const startString = '<div class="d-flex flex-wrap justify-content-end" id="window-detail-cards">'
            const endString = '</div>'
            let innerString = ''
            for (let i = 0; i < this.windowCount; i++) {
                innerString += `<div class="card p-2 window-details" id = "${i}" >${contentString}</div>`
            }

            const detailHTML = startString + innerString + endString
            this.detailsDiv.innerHTML = detailHTML
            this.detailsDiv.querySelectorAll('.window-details').forEach(window => {
                const windowNumber = parseInt(window.id, 10)
                if (doorWindows[windowNumber]) {
                    window.querySelector('#window-name').value = doorWindows[windowNumber]
                    window.querySelector('#window-name').classList.add('readonly-overlay')
                } else { window.querySelector('#window-name').value = `window-${windowNumber + 1}` }
            })
            this.#doorDetailsEventListeners()
        })
    }

    /**
     * Add event listeners for window details selection
     * @method
     * @private
     */
    #doorDetailsEventListeners() {
        document.querySelector('#save-windows-button').addEventListener('click', () => {
            this.windows = []
            this.builderDiv.querySelectorAll('.window-details').forEach(window => {
                const doorWindows = this.doors.getWindowNames()
                const windowNumber = parseInt(window.id, 10)
                let name = window.querySelector('#window-name').value
                let inDoor = false
                if (doorWindows[windowNumber]) {
                    name = doorWindows[windowNumber]
                    inDoor = true
                } else if (name.trim() == '') { name = `window-${windowNumber + 1}` }

                for (const window of this.windows) {
                    if (name == window.name) {
                        name += '(2)'
                        break
                    }
                }
                const operationType = window.querySelector('#operation-type').value
                this.#constructWindowsArray(name, inDoor, operationType)
            })
        })
    }

    /**
     * Create window object and push to windows array based on user selections
     * @method
     * @private
     * @param {string} name
     * @param {boolean} inDoor
     * @param {string} operationType
     */
    #constructWindowsArray(name, inDoor, operationType) {
        const window = {
            name, inDoor,
            isOperable: operationType == 'none' ? false : true,
            operationType
        }
        this.windows.push(window)
    }

    /**
     * Get windows array
     * @method
     * @returns {object[] | null}
     */
    getWindowsArray() {
        if (this.windowCount == 0) { return ErrorMessage.customLogOnly('motorcycles do not have windows') }
        return this.windows
    }
}
