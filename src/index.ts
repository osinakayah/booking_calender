import { processBookings } from "./utils.js";
import  photographersCalenderRecordsJSON from './models/photographers.js'
import {Convert, Photographers} from "./parser/index.js";



const photographersCalenderRecords: Photographers = Convert.toPhotographers(photographersCalenderRecordsJSON);

/* I would have changed "availableTimeSlotsForBooking" function signature to also accepts the
* list of photographers. Example; availableTimeSlotsForBooking(photographers: Photographers, durationInMinutes:number )
* but I decided against it, since a function signature has been provided already, and it would be against
* the task requirements to change it.
*  */

export function availableTimeSlotsForBooking(durationInMinutes: number): {
    photographer: { id: string; name: string }
    timeSlot: { starts: string; ends: string }
}[] {

    if (isNaN(durationInMinutes) || durationInMinutes < 0)  throw 'durationInMinutes is not a valid number'

    const bookings = [];
    for (let i = 0; i < photographersCalenderRecords.photographers.length; i++) {
        const singlePhotographer = photographersCalenderRecords.photographers[i];
        const singleBooking = processBookings(singlePhotographer, durationInMinutes);
        if (singleBooking) {
            bookings.push({
                ...singleBooking,
                timeSlot: {
                    starts: singleBooking.timeSlot.starts.toUTC().toISO(),
                    ends: singleBooking.timeSlot.ends.toUTC().toISO(),
                }
            })
        }
    }
    return  bookings;
}
