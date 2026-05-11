# Task Tracker - Rufi Space

## 👤 Public & Prospective Tenants (Users)
- [x] **Wishlist**
  - [x] Implement `GET /users/:user_id/wishlist` in `/wishlist/page.js`.
  - [x] Add "Add to Wishlist" button in `properties/[id]/page.js` (`POST /users/wishlist`).
- [x] **Appointments**
  - [x] Create booking modal/form on property details page (`POST /appointments`).
  - [x] Create User Dashboard (`/user/appointments`) to view appointments.
  - [x] Display appointment status logically (Pending, Accepted, Rejected, Completed).
- [x] **Reviews**
  - [x] Fetch and display reviews on property details page (`GET /reviews?property_id=...`).
  - [x] Add review submission form for logged-in users (`POST /reviews`).

## 🕵️ Agent Capabilities
- [x] **Property Management**
  - [x] Implement Edit Property functionality for own properties.
  - [ ] Implement Property Status toggle (Available / Sold) (`POST /properties/buy` or Edit).
- [x] **Appointments**
  - [x] View appointments for their specific properties (`GET /appointments?agent=...`).
  - [ ] Add actions to accept/complete appointments (`PUT /appointments/:id/set-agent-appointment-completion`).
- [x] **Wishlist & Reviews**
  - [x] View own Wishlist (`GET /agents/:agent_id/wishlist`).
  - [ ] View Property Reviews for own properties.

## 👑 Merchant (Admin) Capabilities
- [x] **Property Management**
  - [x] Implement Edit Property functionality.
  - [ ] Implement Delete Property functionality (`DELETE /properties/:property_id`).
  - [x] **Verify** properties posted by agents (`PUT /properties/:property_id/set-verified`).
  - [ ] Change Property Status (Available / Sold).
- [ ] **User & Agent Management**
  - [ ] Agents: Manage list (Create, Delete, Update, Verify: `POST /merchants/verify-agent`).
  - [ ] Users: View user list (`GET /users`) and Delete users (`DELETE /users/:user_id`).
- [x] **Appointments & Reviews**
  - [x] View all appointment bookings system-wide.
  - [x] View all reviews system-wide.
  - [x] View Merchant Wishlist (`GET /merchants/:merchant_id/wishlist`).