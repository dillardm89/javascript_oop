import { VehicleBuilder } from '../builder-ui/VehicleBuilder.js'
import { VehicleChassis } from '../components/VehicleChassis.js'
import { ErrorMessage } from '../utils/ErrorMessage.js'
import { EngineConfig } from '../configs/EngineConfig.js'
import { TiresConfig } from '../configs/TiresConfig.js'

/**
 * Represents an interactive vehicle editor
 * @class
 */
export class VehicleEditor {
    /** Creates a new vehicle editor */
    constructor() {
        this.titleDiv = document.querySelector('#vehicle-details')
        this.editorDiv = document.querySelector('#editor-console')
        this.vehicleBuilder = null
        this.vehicle = null
        this.engineDetails = null
        this.tiresDetails = null
        this.doorNames = []
        this.activeDoor = null
        this.windowNames = []
        this.activeWindow = null
        this.seatNames = []
        this.activeSeat = null
        this.#startEventListeners()
    }

    /**
     * Set vehicle builder instance
     * @method
     * @param {string} newBuilder
     */
    setVehicleBuilder(newBuilder) {
        if (newBuilder instanceof VehicleBuilder) { this.vehicleBuilder = newBuilder }
        else { ErrorMessage.invalidInstance('vehicle builder') }
    }

    /**
     * Get instance of VehicleBuilder class
     * @method
     * @private
     * @returns {object | null}
     */
    #getVehicleInstance() {
        if (!this.vehicleBuilder instanceof VehicleBuilder) { return ErrorMessage.invalidInstance('vehicle builder') }
        return this.vehicleBuilder.getVehicleInstance()
    }

    /**
     * Start event listeners once DOM content loaded
     * @method
     * @private
     */
    #startEventListeners() {
        this.editorDiv.querySelector('#load-vehicle-instance-button').addEventListener('click', () => {
            this.vehicle = this.#getVehicleInstance()
            if (!this.vehicle instanceof VehicleChassis) { return ErrorMessage.invalidInstance('vehicle chassis') }

            const vehicleType = this.vehicle.type.charAt(0).toUpperCase() + this.vehicle.type.slice(1)
            this.titleDiv.textContent = `${this.vehicle.year} ${this.vehicle.make} ${this.vehicle.model} (${this.vehicle.color} ${vehicleType})`

            this.#setEngineDetails()
            this.#setTiresDetails()
            this.#setDoorNames()
            this.#setWindowNames()
            this.#setSeatNames()
            this.#engineEventListeners()
            this.#tiresEventListeners()
            this.#doorsEventListeners()
            this.#windowsEventListeners()
            this.#seatsEventListeners()
            this.#resetAppEventListeners()
            window.scrollTo({ top: this.editorDiv.offsetTop, behavior: 'smooth' })
        })
    }

    /**
     * Update DOM with engine details
     * @method
     * @private
     */
    #setEngineDetails() {
        this.engineDetails = this.vehicle.getEngineDetails()
        this.editorDiv.querySelectorAll('.engine-status-options').forEach(option => {
            const currentStatus = this.engineDetails.isRunning ? 'on' : 'off'
            if (option.value == currentStatus) { option.selected = true }
        })

        this.editorDiv.querySelectorAll('.engine-transmission-options').forEach(option => {
            if (option.value == this.engineDetails.transmission) { option.selected = true }
        })

        const validFuels = EngineConfig.getAllowedEngineFuels(this.engineDetails.transmission)
        this.editorDiv.querySelectorAll('.engine-fuel-type-options').forEach(option => {
            if (!validFuels.includes(option.value)) { option.classList.add('d-none') }
            else if (option.value == this.engineDetails.fuel) { option.selected = true }
        })

        const validSizes = EngineConfig.getAllowedEngineSizes(this.engineDetails.vehicleType, this.engineDetails.fuel)
        this.editorDiv.querySelector('#engine-size-label').textContent = `${this.engineDetails.fuel == 'electric' ? 'Size (kWh)' : 'Size (L)'}`
        this.editorDiv.querySelector('#engine-size-input').min = validSizes[0].toString()
        this.editorDiv.querySelector('#engine-size-input').max = validSizes[1].toString()
        this.editorDiv.querySelector('#engine-size-input').step = `${this.engineDetails.fuel == 'electric' ? '5' : '0.1'}`
        this.editorDiv.querySelector('#engine-size-input').value = this.engineDetails.size

        const validGears = EngineConfig.getAllowedEngineGears(this.engineDetails.transmission)
        this.editorDiv.querySelectorAll('.engine-gear-options').forEach(option => {
            option.classList.remove('d-none')
            if (!validGears.includes(option.value)) { option.classList.add('d-none') }
            else if (option.value == this.engineDetails.gear) { option.selected = true }
        })

        this.editorDiv.querySelector('#engine-fuel-level-input').value = this.engineDetails.fuelLevel
        this.editorDiv.querySelector('#engine-speed-input').value = this.engineDetails.speed
    }

    /**
     * Update DOM with tires details
     * @method
     * @private
     */
    #setTiresDetails() {
        this.tiresDetails = this.vehicle.getTiresDetails()
        this.editorDiv.querySelector('#tire-count').textContent = this.tiresDetails.number

        const validSizes = TiresConfig.getAllowedTireSizes(this.tiresDetails.vehicleType)
        this.editorDiv.querySelector('#tire-size-input').min = validSizes[0].toString()
        this.editorDiv.querySelector('#tire-size-input').max = validSizes[1].toString()
        this.editorDiv.querySelector('#tire-size-input').value = this.tiresDetails.size

        const validPressures = TiresConfig.getAllowedTirePressure(this.tiresDetails.vehicleType)
        this.editorDiv.querySelector('#tire-pressure-input').min = validPressures[0].toString()
        this.editorDiv.querySelector('#tire-pressure-input').max = validPressures[1].toString()
        this.editorDiv.querySelector('#tire-pressure-input').value = this.tiresDetails.pressure
    }

    /**
     * Update DOM with doors overview
     * @method
     * @private
     */
    #setDoorNames() {
        this.doorNames = this.vehicle.getDoorNames()
        let doorNamesString = ''
        for (const name of this.doorNames) {
            const nameString = `<option class="door-name-options" value="${name}">${name}</option>`
            doorNamesString += nameString
        }
        this.editorDiv.querySelector('#door-name-select').innerHTML = doorNamesString

        this.editorDiv.querySelector('#door-count').textContent = this.doorNames.length
        this.activeDoor = this.doorNames[0]
        this.#setDoorDetails(this.doorNames[0])
    }

    /**
     * Update DOM with specific door details
     * @method
     * @private
     * @param {string} doorName
     */
    #setDoorDetails(doorName) {
        const doorDetails = this.vehicle.getDoorDetails(doorName)
        this.editorDiv.querySelector('#door-name').innerHTML = `<h4>Door: <u>${doorName}</u></h4>`
        this.editorDiv.querySelector('#door-hinge').textContent = doorDetails.hingeType

        this.editorDiv.querySelectorAll('.door-status-options').forEach(option => {
            const currentStatus = doorDetails.isLocked ? 'locked' : 'unlocked'
            if (option.value == currentStatus) { option.selected = true }
        })

        this.editorDiv.querySelector('#door-position-input').value = doorDetails.position

        if (!doorDetails.hasWindow) { this.editorDiv.querySelector('#door-haswindow').classList.add('d-none') }
        else {
            this.editorDiv.querySelector('#door-haswindow').classList.remove('d-none')
            this.editorDiv.querySelector('#door-window-position-input').value = doorDetails.window.position
        }
    }

    /**
     * Update DOM with windows overview
     * @method
     * @private
     */
    #setWindowNames() {
        this.windowNames = this.vehicle.getWindowNames()
        let windowNameString = ''
        for (const name of this.windowNames) {
            const nameString = `<option class="window-name-options" value="${name}">${name}</option>`
            windowNameString += nameString
        }
        this.editorDiv.querySelector('#window-name-select').innerHTML = windowNameString

        this.editorDiv.querySelector('#window-count').textContent = this.windowNames.length
        this.activeWindow = this.windowNames[0]
        this.#setWindowDetails(this.windowNames[0])
    }

    /**
     * Update DOM with specific window details
     * @method
     * @private
     * @param {string} windowName
     */
    #setWindowDetails(windowName) {
        const windowDetails = this.vehicle.getWindowDetails(windowName)
        this.editorDiv.querySelector('#window-name').innerHTML = `<h4>Window: <u>${windowName}</u></h4>`
        this.editorDiv.querySelector('#window-indoor').textContent = `${windowDetails.inDoor ? 'yes' : 'no'}`

        if (!windowDetails.isOperable) {
            this.editorDiv.querySelector('#window-position-select').classList.add('d-none')
            this.editorDiv.querySelector('#window-not-operable').classList.remove('d-none')
        } else {
            this.editorDiv.querySelector('#window-position-select').classList.remove('d-none')
            this.editorDiv.querySelector('#window-not-operable').classList.add('d-none')
            this.editorDiv.querySelector('#window-position-input').value = windowDetails.position
        }
    }

    /**
     * Update DOM with seats overview
     * @method
     * @private
     */
    #setSeatNames() {
        this.seatNames = this.vehicle.getSeatNames()
        let seatNameString = ''
        for (const name of this.seatNames) {
            const nameString = `<option class="seat-name-options" value="${name}">${name}</option>`
            seatNameString += nameString
        }
        this.editorDiv.querySelector('#seat-name-select').innerHTML = seatNameString

        this.editorDiv.querySelector('#seat-count').textContent = this.seatNames.length
        this.activeSeat = this.seatNames[0]
        this.#setSeatDetails(this.seatNames[0])
    }

    /**
     * Update DOM with specific seat details
     * @method
     * @private
     * @param {string} seatName
     */
    #setSeatDetails(seatName) {
        const seatDetails = this.vehicle.getSeatDetails(seatName)
        this.editorDiv.querySelector('#seat-name').innerHTML = `<h4>Seat: <u>${seatName}</u></h4>`
        this.editorDiv.querySelector('#seat-material').textContent = seatDetails.material
        this.editorDiv.querySelector('#seat-color').textContent = seatDetails.color

        if (!seatDetails.isOperable) {
            this.editorDiv.querySelector('#seat-position-div').classList.add('d-none')
            this.editorDiv.querySelector('#seat-operation-type').textContent = 'not operable'
        } else {
            this.editorDiv.querySelector('#seat-position-div').classList.remove('d-none')
            this.editorDiv.querySelector('#seat-operation-type').textContent = seatDetails.operationType
            this.editorDiv.querySelector('#seat-position-input').value = seatDetails.position.toString()
        }

        const settingValue = ['off', 'low', 'medium', 'high']
        if (!seatDetails.hasHeat) { this.editorDiv.querySelector('#seat-hasheat').classList.add('d-none') }
        else {
            this.editorDiv.querySelector('#seat-hasheat').classList.remove('d-none')
            this.editorDiv.querySelectorAll('.seat-heat-options').forEach(option => {
                const currentSettingInt = parseInt(seatDetails.heatSetting, 10)
                const currentSetting = settingValue[currentSettingInt]
                if (option.value == currentSetting) { option.selected = true }
            })
        }

        if (!seatDetails.hasCool) { this.editorDiv.querySelector('#seat-hascool').classList.add('d-none') }
        else {
            this.editorDiv.querySelector('#seat-hascool').classList.remove('d-none')
            this.editorDiv.querySelectorAll('.seat-cool-options').forEach(option => {
                const currentSettingInt = parseInt(seatDetails.coolSetting, 10)
                const currentSetting = settingValue[currentSettingInt]
                if (option.value == currentSetting) { option.selected = true }
            })
        }
    }

    /**
     * Add event listeners for interactive engine editor
     * @method
     * @private
     */
    #engineEventListeners() {
        // Event listener for engine status selection
        this.editorDiv.querySelectorAll('.engine-status-options').forEach(option => {
            option.addEventListener('click', (event) => {
                let response
                if (event.currentTarget.value == 'on') { response = this.vehicle.startEngine() }
                else { response = this.vehicle.stopEngine() }

                if (!response) { this.#setEngineDetails() }
            })
        })

        // Event listener for engine transmission selection
        this.editorDiv.querySelectorAll('.engine-transmission-options').forEach(option => option.addEventListener('click', (event) => {
            this.vehicle._engine.setTransmission(event.currentTarget.value)
            this.#setEngineDetails()
        }))

        // Event listener for engine fuel type selection
        this.editorDiv.querySelectorAll('.engine-fuel-type-options').forEach(option => option.addEventListener('click', (event) => {
            this.vehicle._engine.setFuel(event.currentTarget.value)
            this.#setEngineDetails()
        }))

        // Event listener for engine fuel level input
        this.editorDiv.querySelector('#engine-fuel-level-input').addEventListener('input', (event) => {
            const response = this.vehicle._engine.setFuelLevel(event.target.value)
            if (!response) { this.#setEngineDetails() }
        })

        // Event listener for engine size input
        this.editorDiv.querySelector('#engine-size-input').addEventListener('input', (event) => {
            const response = this.vehicle._engine.setSize(event.target.value)
            if (!response) { this.#setEngineDetails() }
        })

        // Event listener for engine gear selection
        this.editorDiv.querySelectorAll('.engine-gear-options').forEach(option => option.addEventListener('click', (event) => {
            const response = this.vehicle._engine.setGear(event.currentTarget.value)
            if (!response) { this.#setEngineDetails() }
        }))

        // Event listener for engine speed input
        this.editorDiv.querySelector('#engine-speed-input').addEventListener('input', (event) => {
            const response = this.vehicle._engine.setSpeed(event.target.value)
            if (!response) { this.#setEngineDetails() }
        })
    }

    /**
     * Add event listeners for interactive tires editor
     * @method
     * @private
     */
    #tiresEventListeners() {
        // Event listener for tire size input
        this.editorDiv.querySelector('#tire-size-input').addEventListener('input', (event) => {
            const response = this.vehicle._tires.setSize(event.target.value)
            if (!response) { this.#setTiresDetails() }
        })

        // Event listener for tire pressure input
        this.editorDiv.querySelector('#tire-pressure-input').addEventListener('input', (event) => {
            const response = this.vehicle._tires.setPressure(event.target.value)
            if (!response) { this.#setTiresDetails() }
        })
    }

    /**
     * Add event listeners for interactive doors editor
     * @method
     * @private
     */
    #doorsEventListeners() {
        // Event listener for door name selection
        this.editorDiv.querySelectorAll('.door-name-options').forEach(option => option.addEventListener('click', (event) => {
            this.activeDoor = event.currentTarget.value
            this.#setDoorDetails(event.currentTarget.value)
        }))

        // Event listener for door lock/unlock button
        const toggleLockBtn = this.editorDiv.querySelector('#toggle-door-lock-button')
        toggleLockBtn.addEventListener('click', () => {
            if (toggleLockBtn.classList.contains('lockAll')) {
                this.vehicle.lockAllDoors()
                toggleLockBtn.classList.remove('lockAll')
                toggleLockBtn.firstElementChild.textContent = 'Unlock All Doors'
            } else {
                this.vehicle.unlockAllDoors()
                toggleLockBtn.classList.add('lockAll')
                toggleLockBtn.firstElementChild.textContent = 'Lock All Doors'
            }
            this.#setDoorDetails(this.activeDoor)
        })

        // Event listener for door status selection
        this.editorDiv.querySelectorAll('.door-status-options').forEach(option => {
            option.addEventListener('click', (event) => {
                let response
                if (event.currentTarget.value == 'locked') { response = this.vehicle.lockDoor(this.activeDoor) }
                else { response = this.vehicle.unlockDoor(this.activeDoor) }

                if (!response) { this.#setDoorDetails(this.activeDoor) }
            })
        })

        // Event listener for door window position input
        this.editorDiv.querySelector('#door-window-position-input').addEventListener('input', (event) => {
            const response = this.vehicle.setWindowPosition(this.activeDoor, event.target.value)
            if (!response) { this.#setDoorDetails(this.activeDoor) }
        })

        // Event listener for door position input
        this.editorDiv.querySelector('#door-position-input').addEventListener('input', (event) => {
            const response = this.vehicle.setDoorPosition(this.activeDoor, event.target.value)
            if (!response) { this.#setDoorDetails(this.activeDoor) }
        })
    }

    /**
     * Add event listeners for interactive windows editor
     * @method
     * @private
     */
    #windowsEventListeners() {
        // Event listener for window name selection
        this.editorDiv.querySelectorAll('.window-name-options').forEach(option => option.addEventListener('click', (event) => {
            this.activeWindow = event.currentTarget.value
            this.#setWindowDetails(event.currentTarget.value)
        }))

        // Event listener for window open/close button
        const toggleOpenBtn = this.editorDiv.querySelector('#toggle-window-open-button')
        toggleOpenBtn.addEventListener('click', () => {
            if (toggleOpenBtn.classList.contains('openAll')) {
                this.vehicle.openAllWindows()
                toggleOpenBtn.classList.remove('openAll')
                toggleOpenBtn.firstElementChild.textContent = 'Close All Windows'
            } else {
                this.vehicle.closeAllWindows()
                toggleOpenBtn.classList.add('openAll')
                toggleOpenBtn.firstElementChild.textContent = 'Open All Windows'
            }
            this.#setWindowDetails(this.activeWindow)
        })

        // Event listener for window position input
        this.editorDiv.querySelector('#window-position-input').addEventListener('input', (event) => {
            const response = this.vehicle.setWindowPosition(this.activeWindow, event.target.value)
            if (!response) { this.#setWindowDetails(this.activeWindow) }
        })
    }

    /**
     * Add event listeners for interactive seats editor
     * @method
     * @private
     */
    #seatsEventListeners() {
        // Event listener for seat name selection
        this.editorDiv.querySelectorAll('.seat-name-options').forEach(option => option.addEventListener('click', (event) => {
            this.activeSeat = event.currentTarget.value
            this.#setSeatDetails(event.currentTarget.value)
        }))

        // Event listener for seat position input
        this.editorDiv.querySelector('#seat-position-input').addEventListener('input', (event) => {
            const response = this.vehicle.setSeatPosition(this.activeSeat, event.target.value)
            if (!response) { this.#setSeatDetails(this.activeSeat) }
        })


        const settingValue = ['off', 'low', 'medium', 'high']

        // Event listener for seat heat selection
        this.editorDiv.querySelectorAll('.seat-heat-options').forEach(option => {
            option.addEventListener('click', (event) => {
                const newSetting = settingValue.findIndex(setting => setting == event.target.value)
                const response = this.vehicle.setSeatHeatSetting(this.activeSeat, newSetting)
                if (!response) { this.#setSeatDetails(this.activeSeat) }
            })
        })

        // Event listener for seat cool selection
        this.editorDiv.querySelectorAll('.seat-cool-options').forEach(option => {
            option.addEventListener('click', (event) => {
                const newSetting = settingValue.findIndex(setting => setting == event.target.value)
                const response = this.vehicle.setSeatCoolSetting(this.activeSeat, newSetting)
                if (!response) { this.#setSeatDetails(this.activeSeat) }
            })
        })
    }

    /**
     * Add event listener to reset application button
     * @private
     * @method
     */
    #resetAppEventListeners() {
        this.editorDiv.querySelector('#reset-app-button').addEventListener('click', () => {
            ErrorMessage.warning("This action cannot be undone. Click 'Cancel' to go back or 'Delete' to proceed with creating a new vehicle.")
        })
    }
}
