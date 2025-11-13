import Link from 'next/link';
import ImageWithShimmer from './components/ImageWithShimmer';
import { services } from './lib/data';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 sm:mb-14 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-3 sm:mb-4 tracking-tight">
            Book Your Appointment
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-semibold text-[#FF838A] max-w-2xl mx-auto">
            Your Best Self Starts Now
          </p>
        </div>

        <section aria-label="Available services">
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/booking/${service.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-[#FF6B35] group overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2"
                aria-label={`Book ${service.name} - ${service.description}`}
              >
              {service.imageUrl && (
                <div className="relative w-full h-48 sm:h-56 md:h-60 overflow-hidden bg-gray-100">
                  <ImageWithShimmer
                    src={service.imageUrl}
                    alt={service.name}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    containerClassName="w-full h-full"
                    priority={service.id === services[0].id}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>
              )}
              <div className="p-5 sm:p-6 md:p-7">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 sm:mb-3 group-hover:text-[#FF6B35] transition-colors">
                  {service.name}
                </h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                  {service.description}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#FF838A]">
                  {service.duration}
                </p>
              </div>
            </Link>
          ))}
          </div>
        </section>
      </div>
    </main>
  );
}
