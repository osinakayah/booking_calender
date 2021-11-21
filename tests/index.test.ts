
import { availableTimeSlotsForBooking } from "../dist/index.js";


test('Process bookings', () => {
    const photographersBookings = availableTimeSlotsForBooking(90)
    expect(photographersBookings).toMatchObject(JSON.parse(`[
        {
            "photographer": {
                "id": "1",
                "name": "Otto Crawford"
            },
            "timeSlot": {
                "starts": "2020-11-25T09:30:00.000Z",
                "ends": "2020-11-25T11:00:00.000Z"
            }
        },
        {
            "photographer": {
                "id": "2",
                "name": "Jens Mills"
            },
            "timeSlot": {
                "starts": "2020-11-25T13:00:00.000Z",
                "ends": "2020-11-25T14:30:00.000Z"
            }
        }
    ]`))
});

test('Can handle wrong parameters', () => {
    expect(() => availableTimeSlotsForBooking(-1)).toThrow();
});
