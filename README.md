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
   - Public site: `https://login.psgtech.ac.in/`
   - Command Console & Hero: `https://login.psgtech.ac.in/`
   - Events Index (11): `https://login.psgtech.ac.in/events`
   - Timeline Schedule Grid: `https://login.psgtech.ac.in/timeline`
   - Admin Panel: `https://login.psgtech.ac.in/admin`

   This Compose project does not run Nginx. The frontend listens on its
   internal port `5173` and joins the external Nginx Proxy Manager network
   `npm_default`. Configure Nginx Proxy Manager for `login.psgtech.ac.in` with:
   `login2k26-frontend` as the forward hostname and `5173` as the forward port.
   Nginx Proxy Manager should terminate HTTPS on ports `80` and `443` and
   redirect HTTP to HTTPS. The frontend proxies `/api` internally to the
   private backend container.

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
