# Rufi Space - Implementation Plan

This document outlines the architecture and implementation details for the remaining features of the Rufi Space property platform.

## 1. Project Architecture Overview
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (with custom Brutalist theme in `globals.css`)
- **Authentication**: NextAuth.js v5 (beta) with custom Credentials provider integrating with the external Rework API.
- **Role-based Access Control**: Enforced via Next.js Proxy (`src/proxy.js`) separating `MERCHANT`, `AGENT`, and `USER` routes.

## 2. API Integration Strategy
All external API calls to `property.reworkstaging.name.ng/v1` are routed directly or via server-side fetches.
- **Public Endpoints**: Utilize a public token generated via `/token`.
- **Protected Endpoints**: Utilize the `accessToken` attached to the user's session.

## 3. Pending Feature Implementations

### User Dashboard & Interactions
- **Wishlist**: 
  - Update `/wishlist` to fetch from `GET /users/:user_id/wishlist`.
  - Add "Add to Wishlist" button on property details using `POST /users/wishlist`.
- **Appointments**:
  - Implement a booking modal/page for users to book an appointment (`POST /appointments`).
  - Create a User Dashboard (`/user/appointments`) to track booked appointments.
  - Display appointment statuses clearly (Pending, Accepted, Rejected, Completed).
- **Property Reviews**:
  - Add a Review section to the bottom of the Property Details page (`GET /reviews?property_id=...`).
  - Allow logged-in users to submit a review (`POST /reviews`).

### Merchant (Admin) Capabilities
- **Property Management**: 
  - Edit Property functionality.
  - Delete Property functionality (`DELETE /properties/:property_id`).
  - Verify properties posted by agents (`PUT /properties/:property_id/set-verified`).
  - Change Property Status (Available / Sold).
- **User & Agent Management**:
  - Manage Agents (Create, Delete, Update, View).
  - Manage Users (View list of users, Delete users).
- **Manage Appointments**: 
  - View all appointment bookings.
  - Add Action buttons to Confirm (`PUT /appointments/:id/confirm-meeting`) or Complete/Reject appointments.

### Agent Capabilities
- **Property Management**: 
  - Edit own properties.
  - Change Property Status (Available / Sold) for own properties.
- **Manage Appointments**: 
  - View appointments on own properties.
  - Complete appointments (`PUT /appointments/:id/set-agent-appointment-completion`).