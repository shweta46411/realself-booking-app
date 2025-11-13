import { NextResponse } from 'next/server';
import { getTimeslots } from '@/app/lib/timeslots';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('serviceId');

  if (!serviceId) {
    return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
  }

  const serviceTimeslots = getTimeslots(serviceId);

  if (!serviceTimeslots || serviceTimeslots.length === 0) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  return NextResponse.json(
    { timeslots: serviceTimeslots },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}