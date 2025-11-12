import { Timeslot } from './types';

const timeslotsData: Record<string, Timeslot[]> = {
  facial: [
    { id: '1', time: '09:00', available: true },
    { id: '2', time: '10:00', available: true },
    { id: '3', time: '11:00', available: true },
    { id: '4', time: '12:00', available: true },
    { id: '5', time: '13:00', available: true },
    { id: '6', time: '14:00', available: true },
    { id: '7', time: '15:00', available: true },
    { id: '8', time: '16:00', available: true },
    { id: '9', time: '17:00', available: true },
  ],
  botox: [
    { id: '1', time: '09:00', available: true },
    { id: '2', time: '09:30', available: true },
    { id: '3', time: '10:00', available: true },
    { id: '4', time: '10:30', available: true },
    { id: '5', time: '11:00', available: true },
    { id: '6', time: '11:30', available: true },
    { id: '7', time: '12:00', available: true },
    { id: '8', time: '13:00', available: true },
    { id: '9', time: '13:30', available: true },
    { id: '10', time: '14:00', available: true },
    { id: '11', time: '14:30', available: true },
    { id: '12', time: '15:00', available: true },
    { id: '13', time: '15:30', available: true },
    { id: '14', time: '16:00', available: true },
    { id: '15', time: '16:30', available: true },
    { id: '16', time: '17:00', available: true },
  ],
  'hair-removal': [
    { id: '1', time: '09:00', available: true },
    { id: '2', time: '10:00', available: true },
    { id: '3', time: '11:00', available: true },
    { id: '4', time: '12:00', available: true },
    { id: '5', time: '13:00', available: true },
    { id: '6', time: '14:00', available: true },
    { id: '7', time: '15:00', available: true },
    { id: '8', time: '16:00', available: true },
    { id: '9', time: '17:00', available: true },
    { id: '10', time: '18:00', available: true },
  ],
};

const bookedSlots = new Set<string>();

export function getTimeslots(serviceId: string): Timeslot[] {
  const slots = timeslotsData[serviceId];
  if (!slots) return [];

  return slots.map((slot) => ({
    ...slot,
    available: slot.available && !bookedSlots.has(`${serviceId}-${slot.id}`),
  }));
}

export function markSlotAsBooked(serviceId: string, slotId: string): void {
  bookedSlots.add(`${serviceId}-${slotId}`);
}

