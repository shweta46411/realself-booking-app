import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BookingForm from '@/app/booking/[serviceId]/BookingForm';
import { Service, Timeslot } from '@/app/lib/types';

const mockService: Service = {
  id: 'facial',
  name: 'Facial Treatment',
  description: 'Deep cleansing facial',
  duration: '60 minutes',
};

const mockTimeslots: Timeslot[] = [
  { id: '1', time: '09:00', available: true },
  { id: '2', time: '10:00', available: true },
];

global.fetch = vi.fn();

describe('BookingForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(<BookingForm service={mockService} timeslots={mockTimeslots} />);
    
    expect(screen.getByText('Select a Timeslot')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book appointment/i })).toBeInTheDocument();
  });

  it('displays available timeslots', () => {
    render(<BookingForm service={mockService} timeslots={mockTimeslots} />);
    
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('shows validation errors for empty form', async () => {
    render(<BookingForm service={mockService} timeslots={mockTimeslots} />);
    
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('handles successful booking', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        booking: {
          name: 'John Doe',
          email: 'john@example.com',
          timeslot: '09:00',
        },
      }),
    });

    render(<BookingForm service={mockService} timeslots={mockTimeslots} />);
    
    fireEvent.click(screen.getByText('09:00'));
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    await waitFor(() => {
      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
    });
  });

  it('handles conflict error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        error: 'Timeslot is no longer available',
        conflict: true,
      }),
    });

    render(<BookingForm service={mockService} timeslots={mockTimeslots} />);
    
    fireEvent.click(screen.getByText('09:00'));
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    await waitFor(() => {
      expect(screen.getByText(/just booked by someone else/i)).toBeInTheDocument();
    });
  });
});

