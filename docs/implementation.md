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

### Merchant & Agent Capabilities
- **Delete Properties**: Add a delete button in Merchant and Agent dashboards (`DELETE /properties/:property_id`).
- **Edit Properties (Merchant)**: Allow merchants to edit properties, similar to the existing agent edit functionality.
- **Manage Appointments**: Add Action buttons to Confirm (`PUT /appointments/:id/confirm-meeting`) or Complete (`PUT /appointments/:id/set-agent-appointment-completion`) appointments.

### Property Reviews
- Add a Review section to the bottom of the Property Details page (`GET /reviews?property_id=...`).
- Allow logged-in users to submit a review (`POST /reviews`).

## 4. Design Language
- **Brutalism**: High contrast, uppercase text, strict grid lines (`hairline-all`, `hairline-b`), and limited rounded corners.
- **Interactions**: GSAP animations used sparingly for impactful reveals and hover states (e.g., `PropertyCard` drift effect).
