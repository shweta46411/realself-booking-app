import { NextResponse } from 'next/server';
import { bookingSchema } from '@/app/lib/validation';
import { getTimeslots, markSlotAsBooked } from '@/app/lib/timeslots';
import { services } from '@/app/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = bookingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.issues },
        { status: 400 }
      );
    }

    const { timeslot, serviceId } = body;

    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const slots = getTimeslots(serviceId);
    const slot = slots.find((s) => s.id === timeslot);

    if (!slot) {
      return NextResponse.json({ error: 'Timeslot not found' }, { status: 404 });
    }

    if (!slot.available) {
      return NextResponse.json(
        { error: 'Timeslot is no longer available', conflict: true },
        { status: 409 }
      );
    }

    markSlotAsBooked(serviceId, slot.id);

    const service = services.find((s) => s.id === serviceId);
    const serviceName = service?.name || 'Service';

    const sanitizedName = validated.data.name.trim().replace(/\s+/g, ' ');
    const sanitizedEmail = validated.data.email.trim().toLowerCase();

    const bookingData = {
      name: sanitizedName,
      email: sanitizedEmail,
      serviceId,
      timeslot: slot.time,
      timeslotId: slot.id,
    };

    return NextResponse.json(
      {
        success: true,
        booking: bookingData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process booking',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 }
    );
  }
}

