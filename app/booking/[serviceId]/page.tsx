import { notFound } from 'next/navigation';
import ImageWithShimmer from '@/app/components/ImageWithShimmer';
import { services } from '@/app/lib/data';
import { getBaseUrl, fetchWithTimeout } from '@/app/lib/api';
import { REQUEST_TIMEOUT } from '@/app/lib/constants';
import BookingForm from './BookingForm';

async function fetchTimeslots(serviceId: string) {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetchWithTimeout(
      `${baseUrl}/api/timeslots?serviceId=${serviceId}`,
      { cache: 'no-store' },
      REQUEST_TIMEOUT
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.timeslots || [];
  } catch {
    return [];
  }
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    notFound();
  }

  const timeslots = await fetchTimeslots(serviceId);

  return (
    <div className="min-h-screen bg-white">
      {service.imageUrl && (
        <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden">
          <ImageWithShimmer
            src={service.imageUrl}
            alt={service.name}
            width={1200}
            height={400}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight drop-shadow-lg">
              Book {service.name}
            </h1>
            <p className="text-sm sm:text-base md:text-lg mb-1.5 drop-shadow-md">{service.description}</p>
            <p className="text-xs sm:text-sm font-semibold text-[#FF838A] drop-shadow-md">
              {service.duration}
            </p>
          </div>
        </div>
      )}
      <div className="py-6 sm:py-8 md:py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {!service.imageUrl && (
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 tracking-tight">
                Book {service.name}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-2 sm:mb-3">{service.description}</p>
              <p className="text-sm sm:text-base font-semibold text-[#FF838A]">
                {service.duration}
              </p>
            </div>
          )}

          {service.details && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-4 sm:mb-5">
                Service Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                {service.details.whatToExpect && service.details.whatToExpect.length > 0 && (
                  <div className="bg-[#FDF2EE] rounded-lg p-5 border border-[#FF838A]">
                    <h3 className="text-sm sm:text-base font-semibold text-[#FF6B35] mb-3">
                      What to Expect
                    </h3>
                    <ul className="space-y-2">
                      {service.details.whatToExpect.map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700 leading-relaxed">
                          <span className="text-[#FF6B35] mr-2 font-bold flex-shrink-0 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.details.benefits && service.details.benefits.length > 0 && (
                  <div className="bg-[#FDF2EE] rounded-lg p-5 border border-[#FF838A]">
                    <h3 className="text-sm sm:text-base font-semibold text-[#FF6B35] mb-3">
                      Benefits
                    </h3>
                    <ul className="space-y-2">
                      {service.details.benefits.map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700 leading-relaxed">
                          <span className="text-[#FF6B35] mr-2 font-bold flex-shrink-0 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.details.preparation && service.details.preparation.length > 0 && (
                  <div className="bg-[#FDF2EE] rounded-lg p-5 border border-[#FF838A]">
                    <h3 className="text-sm sm:text-base font-semibold text-[#FF6B35] mb-3">
                      Preparation
                    </h3>
                    <ul className="space-y-2">
                      {service.details.preparation.map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700 leading-relaxed">
                          <span className="text-[#FF6B35] mr-2 font-bold flex-shrink-0 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <BookingForm service={service} timeslots={timeslots} />
        </div>
      </div>
    </div>
  );
}

