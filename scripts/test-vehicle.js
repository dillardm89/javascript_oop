import { VehicleChassis } from '../class/components/VehicleChassis.js'
import { Engine } from '../class/components/Engine.js'
import { Tires } from '../class/components/Tires.js'
import { Door } from '../class/components/Door.js'
import { Window } from '../class/components/Window.js'
import { Seat } from '../class/components/Seat.js'

/**
 * Creates an instance of VehicleChassis class for testing purposes
 * @returns {VehicleChassis}
 */
export function createVehicleInstance() {
    const vehicle = new VehicleChassis(2020, 'Hyundai', 'Elantra GT', 'White', 'car')

    const engine = new Engine('car', 'electric', 60, 'automatic')

    const tires = new Tires('car', 4, 17, 34)

    const door1 = new Door('driver')
    const door2 = new Door('passenger')
    const door3 = new Door('rear-driver')
    const door4 = new Door('rear-passenger')
    const door5 = new Door('trunk')
    const doors = []
    doors.push(door1, door2, door3, door4, door5)

    const seat1 = new Seat('driver', 'leather', 'grey', true, 'electric', true, true)
    const seat2 = new Seat('passenger', 'leather', 'grey', 'manual', true, false)
    const seat3 = new Seat('rear-driver', 'cloth', 'black')
    const seat4 = new Seat('rear-passenger', 'cloth', 'black')
    const seat5 = new Seat('rear-middle', 'cloth', 'black')
    const seats = []
    seats.push(seat1, seat2, seat3, seat4, seat5)

    const window1 = new Window('windshield')
    const window2 = new Window('driver', true, true, 'electric')
    const window3 = new Window('passenger', true, true, 'electric')
    const window4 = new Window('rear-driver', true, true, 'manual')
    const window5 = new Window('rear-passenger', true, true, 'manual')
    const windows = []
    windows.push(window1, window2, window3, window4, window5)

    door1.setWindow(window2)
    door2.setWindow(window3)
    door3.setWindow(window4)
    door4.setWindow(window5)

    vehicle.engine = engine
    vehicle.tires = tires
    vehicle.addAllDoors(doors)
    vehicle.addAllSeats(seats)
    vehicle.addAllWindows(windows)

    return vehicle
}
