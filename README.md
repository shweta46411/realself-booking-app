# RealSelf Booking Application

A booking application designed for beauty and wellness services such as **facial treatments**, **botox consultations**, and **hair removal**.  
Users can browse services, check real-time appointment availability, and complete a simple booking flow through a clean, fast, and accessible interface.

This project showcases modern engineering practices using **Next.js 16**, **TypeScript**, and **Tailwind CSS**, with a focus on performance, accessibility, type safety, and maintainable component architecture.

---

## Overview

The application implements a complete booking workflow:

- Display available services
- Fetch timeslot availability on the server
- Handle timeslot conflicts and state updates
- Validate submissions on both client and server
- Provide clear loading and error states
- Maintain a clean, responsive UI across devices

It demonstrates how to structure a real-world booking experience using modern Next.js patterns, including App Router, Server Components, and API routes.

---

## Features

### Core Functionality
- Browse a catalog of beauty/wellness services
- Server-side generated and cached timeslots
- Conflict detection for booked slots
- Booking form with name, email, and time selection

### UI/UX
- Fully responsive layout
- Progressive loading and shimmer effects
- Semantic HTML, keyboard support, and ARIA labels
- Real-time form validation and clear error handling

### Performance
- Static generation + ISR
- Optimized images (AVIF/WebP)
- Lazy loading for non-critical components
- Tree shaking and code splitting
- API response caching

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript  
- **Styling:** Tailwind CSS v4  
- **Forms:** React Hook Form + Zod  
- **Testing:** Vitest + React Testing Library  
- **Deployment:** Render or Vercel  

---

## Getting Started

### Prerequisites
- Node.js **20.9.0+**
- npm / yarn / pnpm

### Installation

```bash
git clone https://github.com/shweta46411/realself-booking-app.git
cd realself-booking-app
npm install

###Development
npm run dev

###Production Build
npm run build
npm start

###Project Structure
realself-booking-app/
├── app/
│   ├── api/
│   │   ├── bookings/       # Booking submission endpoint
│   │   └── timeslots/      # Timeslot availability endpoint
│   ├── booking/
│   │   └── [serviceId]/    # Dynamic booking page
│   ├── components/         # Reusable UI components
│   ├── lib/                # Data, helpers, constants, validation
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Home page
├── __tests__/              # Component and API tests
├── public/
├── next.config.ts
└── package.json

###Type Safety & Validation

Zod schemas for client-side and server-side validation
Strong TypeScript typing across the codebase
Shared domain types for consistency
Strict TypeScript configuration enabled

###Testing
npm test




