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
    const { container } = render(<BookingForm service={mockService} timeslots={mockTimeslots} />);
    
    expect(screen.getByText('Select a Timeslot')).toBeInTheDocument();
    const nameInputs = screen.getAllByLabelText(/name/i);
    expect(nameInputs.length).toBeGreaterThan(0);
    const emailInputs = screen.getAllByLabelText(/email/i);
    expect(emailInputs.length).toBeGreaterThan(0);
    const buttons = screen.getAllByRole('button', { name: /book appointment/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('displays available timeslots', () => {
    render(<BookingForm service={mockService} timeslots={mockTimeslots} />);
    
    const timeSlots = screen.getAllByText('09:00');
    expect(timeSlots.length).toBeGreaterThan(0);
    expect(screen.getAllByText('10:00').length).toBeGreaterThan(0);
  });

  it('shows validation errors for empty form', async () => {
    render(<BookingForm service={mockService} timeslots={mockTimeslots} />);
    
    const submitButtons = screen.getAllByRole('button', { name: /book appointment/i });
    const form = submitButtons[0].closest('form');
    if (form) {
      fireEvent.submit(form);
    } else {
      fireEvent.click(submitButtons[0]);
    }

    await waitFor(() => {
      const errors = screen.queryAllByText(/name is required|please select a timeslot/i);
      expect(errors.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
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
    
    const timeSlots = screen.getAllByText('09:00');
    fireEvent.click(timeSlots[0]);
    const nameInputs = screen.getAllByLabelText(/name/i);
    const emailInputs = screen.getAllByLabelText(/email/i);
    fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
    fireEvent.change(emailInputs[0], { target: { value: 'john@example.com' } });
    const submitButtons = screen.getAllByRole('button', { name: /book appointment/i });
    fireEvent.click(submitButtons[0]);

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
    
    const timeSlots = screen.getAllByText('09:00');
    fireEvent.click(timeSlots[0]);
    const nameInputs = screen.getAllByLabelText(/name/i);
    const emailInputs = screen.getAllByLabelText(/email/i);
    fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
    fireEvent.change(emailInputs[0], { target: { value: 'john@example.com' } });
    const submitButtons = screen.getAllByRole('button', { name: /book appointment/i });
    fireEvent.click(submitButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/just booked by someone else/i)).toBeInTheDocument();
    });
  });
});

