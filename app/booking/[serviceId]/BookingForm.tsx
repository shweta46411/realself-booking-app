'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, BookingFormData } from '@/app/lib/validation';
import { getBaseUrl, fetchWithTimeout } from '@/app/lib/api';
import { Service, Timeslot } from '@/app/lib/types';
import { REQUEST_TIMEOUT } from '@/app/lib/constants';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Modal from '@/app/components/Modal';

interface BookingFormProps {
  service: Service;
  timeslots: Timeslot[];
}

export default function BookingForm({ service, timeslots: initialTimeslots }: BookingFormProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTimeslots, setCurrentTimeslots] = useState<Timeslot[]>(initialTimeslots);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError: setFormError,
    getValues,
    reset,
    trigger,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange',
  });

  const currentTimeslot = watch('timeslot');
  const name = watch('name');
  const email = watch('email');

  const isFormValid = Boolean(
    currentTimeslot &&
    name?.trim().length >= 2 &&
    /^[a-zA-Z\s]+$/.test(name?.trim() || '') &&
    email?.trim() &&
    email.includes('@') &&
    email.includes('.')
  );

  const fetchTimeslots = async () => {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetchWithTimeout(
        `${baseUrl}/api/timeslots?serviceId=${service.id}`,
        { cache: 'no-store' },
        REQUEST_TIMEOUT
      );
      if (res.ok) {
        const data = await res.json();
        setCurrentTimeslots(data.timeslots || []);
      }
    } catch {
      // Fail silently
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setError(null);

    try {
      const baseUrl = getBaseUrl();
      const res = await fetchWithTimeout(
        `${baseUrl}/api/bookings`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            serviceId: service.id,
          }),
        },
        REQUEST_TIMEOUT
      );

      const result = await res.json();

      if (!res.ok) {
        if (result.conflict) {
          setError('This timeslot was just booked by someone else. Please select another time.');
          setFormError('timeslot', {
            type: 'manual',
            message: 'Timeslot no longer available',
          });
          setValue('timeslot', '', { shouldValidate: false });
          await fetchTimeslots();
        } else {
          setError(result.error || 'Something went wrong. Please try again.');
        }
        return;
      }

      await fetchTimeslots();
      setIsModalOpen(true);
    } catch (err) {
      if (err instanceof Error && err.message === 'Request timeout') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    }
  };

  const handleTimeslotSelect = (slotId: string) => {
    const slot = currentTimeslots.find((s) => s.id === slotId);
    if (slot && slot.available) {
      setError(null);
      setValue('timeslot', slotId, { shouldValidate: true });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    reset();
    setError(null);
    router.push('/');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-7 space-y-4 sm:space-y-5">
        <fieldset disabled={isSubmitting}>
          <fieldset className="border-0 p-0 m-0">
            <legend className="block text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">
              Select a Timeslot
              <span className="text-[#FF838A] ml-1" aria-label="required">*</span>
            </legend>
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4"
            role="group"
            aria-label="Available timeslots"
          >
            {currentTimeslots.length === 0 ? (
              <p className="col-span-full text-gray-500 text-base" role="status">
                No available timeslots
              </p>
            ) : (
              currentTimeslots.map((slot) => {
                const isSelected = currentTimeslot === slot.id;
                const isBooked = !slot.available;
                
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => handleTimeslotSelect(slot.id)}
                    disabled={isBooked}
                    aria-pressed={isSelected ? 'true' : 'false'}
                    aria-disabled={isBooked}
                    aria-label={isBooked ? `${slot.time} - Already booked` : `${slot.time} - Available`}
                    className={`px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3 rounded-xl border-2 transition-all text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 ${
                      isBooked
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'border-[#FF6B35] bg-[#FF6B35] text-white shadow-md'
                        : 'border-gray-300 hover:border-[#FF838A] text-black hover:text-[#FF838A]'
                    }`}
                  >
                    {slot.time}
                    {isBooked && <span className="ml-1 text-xs" aria-hidden="true">(Booked)</span>}
                  </button>
                );
              })
            )}
          </div>
          {errors.timeslot && (
            <p className="mt-2 text-sm font-medium text-[#FF838A]" role="alert" id="timeslot-error">
              {errors.timeslot.message}
            </p>
          )}
          </fieldset>

        <Input
          label="Name"
          required
          {...register('name', {
            onChange: () => trigger('name'),
          })}
          error={errors.name?.message}
          placeholder="Enter your name"
        />

        <Input
          label="Email"
          type="email"
          required
          {...register('email', {
            onChange: () => trigger('email'),
          })}
          error={errors.email?.message}
          placeholder="Enter your email"
        />

        {error && error.trim() ? (
          <div className="p-3 sm:p-4 bg-red-50 border-2 border-[#FF838A] rounded-lg" role="alert" aria-live="assertive">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        ) : null}

        </fieldset>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
          disabled={!isFormValid || isSubmitting}
          className="w-full py-3 sm:py-4 text-base sm:text-lg"
        >
          Book Appointment
        </Button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Booking Confirmed!"
      >
        <div className="space-y-4 sm:space-y-6">
          <p className="text-base sm:text-lg text-gray-700">
            Your appointment for <strong className="text-[#FF6B35]">{service.name}</strong> has been
            confirmed!
          </p>
          <div className="bg-[#FDF2EE] rounded-xl p-4 sm:p-6 space-y-2 sm:space-y-3 border-2 border-[#FF838A]">
            <p className="text-sm sm:text-base">
              <span className="font-bold text-black">Service:</span> <span className="text-gray-700">{service.name}</span>
            </p>
            <p className="text-sm sm:text-base">
              <span className="font-bold text-black">Time:</span>{' '}
              <span className="text-gray-700">{currentTimeslots.find((s) => s.id === getValues('timeslot'))?.time}</span>
            </p>
            <p className="text-sm sm:text-base">
              <span className="font-bold text-black">Duration:</span> <span className="text-gray-700">{service.duration}</span>
            </p>
          </div>
          <Button
            onClick={handleModalClose}
            className="w-full py-3 sm:py-4 text-base sm:text-lg"
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}

