import {Duration, Interval} from 'luxon'
import {Booking, Photographer, Availability} from "./parser/index.js";



const BOOKING_TIME_UNIT = 'minutes';




export function processBookings(singlePhotographer: Photographer, durationInMinutes: number): {
    photographer: { id: string; name: string }
    timeSlot: Availability
}|undefined {

    const allAvailableFreeSlots: Availability[] = []
    const sortedAvailabilities = singlePhotographer.availabilities.sort((a, b) => a.starts < b.starts ? -1 : a.starts > b.starts ? 1 : 0)

    for (let i = 0; i < sortedAvailabilities.length; i++) {
        const singleAvailability = sortedAvailabilities[i];
        const availableInterval = Interval.fromDateTimes(singleAvailability.starts, singleAvailability.ends);
        const unbookedSlots = getFreeAvailableSlots(availableInterval, singlePhotographer.bookings, durationInMinutes);

        const slotsToFitInNewBooking: Availability[] = getSlotsToFitInNewBooking(unbookedSlots, durationInMinutes);
        slotsToFitInNewBooking.forEach((availability)=>{
            allAvailableFreeSlots.push(availability)
        });
    }
    allAvailableFreeSlots.sort((a, b) => a.starts < b.starts ? -1 : a.starts > b.starts ? 1 : 0)
    if (allAvailableFreeSlots.length > 0) {
        return {
            photographer: {
                id: singlePhotographer.id,
                name: singlePhotographer.name,
            },
            timeSlot: allAvailableFreeSlots[0]
        }
    }

}


function isEnoughTime(interval: Interval, duration: number): boolean {
    return interval.length(BOOKING_TIME_UNIT) >= duration
}



function getFreeAvailableSlots(availableSlot: Interval, alreadyBookings: Booking[], durationInMinutes: number): Interval[]{
    const bookingsIntervals = alreadyBookings.map((booking)=>{
        return Interval.fromDateTimes(booking.starts, booking.ends)
    });
    const duration =  Duration.fromObject({
        minutes: durationInMinutes
    })
    const freeSlots =  availableSlot.difference(...bookingsIntervals);
    const splitFreeSpotsByDuration = [];
    freeSlots.forEach((singleFreeSlot)=>{
        splitFreeSpotsByDuration.push(...singleFreeSlot.splitBy(duration));
    });
    return  splitFreeSpotsByDuration.flat(1)

}


function getSlotsToFitInNewBooking(freeSlots: Interval[], duration: number): Availability[] {

    const validTimeSlots = []

    for (let i = 0; i < freeSlots.length; i ++) {
        const singleFreeSlot = freeSlots[i];
        if (isEnoughTime(singleFreeSlot,duration)) {
            validTimeSlots.push({
                starts: singleFreeSlot.start,
                ends: singleFreeSlot.end,
            })
        }
    }
    return validTimeSlots
}

