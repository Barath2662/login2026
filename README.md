# LOGIN 2026 — Master Web Platform Documentation

This repository contains the complete server-rendered Multi-Page Application (MPA) for **LOGIN 2026**, the 35th Edition National Technical Symposium organized by the Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore.

---

## 1. Setup & Installation Guide

### Prerequisites
- Node.js 20 LTS & npm 10
- Database: SQLite (default dev mode via `USE_SQLITE=true`) or PostgreSQL
- SMTP account (Gmail App Password or custom SMTP server)

### Step-by-Step Installation
1. Clone the repository and install server dependencies:
   ```bash
   npm install
   ```
2. Create environment file:
   ```bash
   cp .env.example .env
   ```
3. Initialize the database schema & seed official events:
   ```bash
   node server/seed_events.js
   ```
4. Start the Express application:
   ```bash
   node server/server.js
   ```
5. Access the site in your browser:
   - Command Console & Hero: `http://localhost:5000/`
   - Events Index (11): `http://localhost:5000/events`
   - Timeline Schedule Grid: `http://localhost:5000/timeline`
   - Admin Panel: `http://localhost:5000/admin`

---

## 2. Organizing Committee Operations Sheet

| Action | Execution Procedure |
|---|---|
| **Add or Modify Event** | Go to `/admin?tab=events`, fill the event details form (name, category, team size, venue, IST timings), and click Save. Changes trigger SSE live timeline updates. |
| **Verify Participant Payment** | Go to `/admin?tab=payments`, review the submitted UTR reference code, and click **APPROVE**. This generates the unique `LGN26-XXXX` Student ID and unlocks event registrations for the user. |
| **Reject Invalid Payment** | Click **REJECT**, type a clear reason (e.g. "UTR not found on bank statement"), and submit. The participant can resubmit a corrected reference code. |
| **Assign Event Coordinator** | Go to `/admin?tab=users`, change the user's role to `event_coordinator`. On their first login, they will be forced to change their default password. |
| **Broadcast Ticker Announcement** | Go to `/admin?tab=announcements`, enter the title tag and broadcast message, and click **BROADCAST**. The message immediately streams across the site header. |
| **Export Registrations to CSV** | Go to `/admin?tab=participants` and click **EXPORT PARTICIPANTS CSV**. |
