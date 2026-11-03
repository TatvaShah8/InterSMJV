# INTER SMJV 2026 — Inter-Hostel Sports & Cultural Festival, Vadodara
### આંતર હોસ્ટેલ ખેલ મહોત્સવ · ૧૪ થી ૧૮ ડિસેમ્બર ૨૦૨૬
> **A resilient, mobile-first festival web portal built with a fully compartmentalized React architecture, fault-tolerant error boundaries, persistent cookie authentication, and live scannable SVG QR accreditation passes.**

---

## 📑 Table of Contents
1. [Festival Overview](#1-festival-overview)
2. [Website Architecture & Flow](#2-website-architecture--flow)
   - [System Architecture & Fault Isolation](#system-architecture--fault-isolation)
   - [User Journeys & Workflow Diagrams](#user-journeys--workflow-diagrams)
3. [Page-by-Page Descriptions](#3-page-by-page-descriptions)
4. [Complete Festival Rules & Guidelines](#4-complete-festival-rules--guidelines)
   - [General Competition Rules](#general-competition-rules)
   - [Sport-by-Sport Rules (10 Disciplines)](#sport-by-sport-rules-10-disciplines)
5. [Compartmentalization & Fault Tolerance Strategy](#5-compartmentalization--fault-tolerance-strategy)
6. [Tech Stack & Getting Started](#6-tech-stack--getting-started)

---

## 1. Festival Overview

* **Event Name:** INTER SMJV 2026 (આંતર હોસ્ટેલ ખેલ મહોત્સવ)
* **Host Location:** Shri Mahavira Jaina Vidyalaya (SMJV) Hostel Branch, Vadodara, Gujarat
* **Tournament Dates:** 14–18 December 2026 (5 Days)
* **Participating Hostels (8 Gujarat River Branches):** Narmada, Tapi, Mahi, Sabarmati, Vishwamitri, Aji, Damanganga, Shetrunji.
* **Sports Included:** Cricket, Football, Volleyball, Pickleball, Kho-Kho, Throwball, Tug of War, Badminton, Table Tennis, Chess, and Carrom.
* **Design Philosophy:** Kinetic energy inspired by the Paris 2024 Olympics fused with vibrant Gujarati cultural motifs (Bandhani gradients, Noto Sans Gujarati typography, and midnight indigo liquid glassmorphic surfaces).

---

## 2. Website Architecture & Flow

### System Architecture & Fault Isolation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             INTER SMJV 2026 APP                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Browser URL Router & History API Synchronization (src/utils/router.js)  │ │
│ │ • Clean URLs: /schedule, /contact, /rulebook, /sports, /sports/:sport   │ │
│ │ • Browser Back / Forward Button Popstate Sync & Dynamic Tab Titles      │ │
│ │ • URL Aliases: /pages/schedule, /pages/contact, /rules, /mess, etc.     │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ <ErrorBoundary name="Header">                                           │ │
│ │   [Header Bar: Logo, Navigation, Unread Badge, Theme Toggle, Profile]   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ <ToastContainer /> (Floating push-style alerts, 5.2s auto-dismiss)      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Active View Router (15 Independent Compartmentalized View Blocks):       │ │
│ │                                                                         │ │
│ │ ┌───────────────────────────┐         ┌───────────────────────────────┐ │ │
│ │ │ <ErrorBoundary name=".."> │         │ <ErrorBoundary name="..">     │ │ │
│ │ │     <HomeView />          │  . . .  │     <RegistrationFlow />      │ │ │
│ │ └───────────────────────────┘         └───────────────────────────────┘ │ │
│ │  (If a component throws an error, only that section displays a fallback │ │
│ │   recovery card with [Reload Section]; all other pages keep working!)   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ <ErrorBoundary name="Footer">                                           │ │
│ │   [Footer: 24/7 Helpline, SMJV Campus Details, Links, DLT/WCAG AA Info] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ <MobileNav /> (Bottom fixed 5-tab bar on mobile devices)                │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ <IdCardModal /> (Accessible globally by clicking avatar/photo)          │ │
│ │   [Student Photo, GR, Name, Branch, Role, Sports, Scannable QR Code]    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### User Journeys & Workflow Diagrams

#### Workflow A: Student Athlete Registration & Pass Generation
```
[User Clicks "Register"]
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 1: ACCOUNT & IDENTITY (Before Verification)           │
│ First Name, Middle Name, Surname, Email ID, Password,       │
│ 10-Digit Mobile Number, Gender (Male/Female/Other), GR No   │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 2: DUAL SECURITY VERIFICATION                         │
│ • Email OTP Verification (Simulated code / 6-digit box)    │
│ • Mobile OTP Verification (Simulated code / 6-digit box)   │
│ • "⚡ Quick Verify Both" helper for fast testing            │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 3: GENERAL STUDENT QUESTIONS (After Verification)     │
│ • Date of Birth (3 input ways: Dropdowns / Calendar / Type) │
│ • Portrait Photo Upload (Instant Base64 image preview)      │
│ • SMJV Branch Dropdown (Vadodara, Ahmedabad, Mumbai, etc.)  │
│ • Auto-Calculated Age, Hometown, College, Course, Year      │
│ • Blood Group (A+, B+, O+, etc.), Emergency Contact & Rel.  │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 4: ROLE & SPORTS SELECTION                            │
│ Select: [Sports Team] / [Cultural Team] / [Visitor]         │
│ If Sports Team:                                             │
│   • Kit: T-Shirt Size (XS–XXL) & Track Pant Waist (28–40)   │
│   • If Male: Enforce 2 Outdoor + 1 Indoor OR 1 Out + 2 In   │
│   • If Female: Outdoor: "📢 Coming soon, we will decide     │
│                that afterwards", Indoor: TT, Chess, etc.    │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 5: COMPLETED ACCREDITATION PASS                       │
│ • Generates Real Scannable SVG QR Code                      │
│ • Saves Login (Email & Password) to Browser Cookies (365 d) │
│ • Saves Complete Profile to LocalStorage                    │
│ • Auto-Restores on Every Revisit (No re-login required!)    │
│ • Direct Buttons: [🪪 View ID Card] [🖨️ Print Pass]        │
└─────────────────────────────────────────────────────────────┘
```

#### Workflow B: Global Profile & ID Card Inspection Flow
1. At any time, regardless of what page you are viewing, click on the **Profile Icon (Portrait)** in the top navigation bar.
2. The **`<IdCardModal />`** pops open with a darkened glassmorphic backdrop.
3. The card displays the student's uploaded portrait, Full Name, G.R. Number, SMJV Branch badge, Blood Group, Age, Registered Sports chips, Emergency Contact, digital barcode, and **real-time scannable QR Code**.
4. Click **"🖨️ Print / Save Pass"** to trigger a clean printable accreditation pass or **"Close"** to dismiss.

---

## 3. Page-by-Page Descriptions

### 1. `HomeView` (`/pages/HomeView.jsx`)
* **Hero Section:** High-impact kinetic typography ("INTER SMJV 2026") paired with a stadium night lights backdrop and an animated live indicator ("LIVE NOW · DAY 3 OF 5 · VADODARA").
* **Live Match Banner:** Displays live set/over scores for ongoing ties (e.g. Volleyball Semi-Final 1: Narmada vs Vishwamitri).
* **Countdown Clock:** Live seconds-level countdown clock ticking down to the final championship whistle (18 Dec 2026, 19:00 IST).
* **Quick Day Schedule:** Interactive 5-day tabbed preview showing morning, afternoon, and evening ties.
* **Campus Ground Spotlight:** Interactive tiles detailing the 6 main playing surfaces with directions.
* **Vadodara Landmarks Teaser:** Showcase cards for Laxmi Vilas Palace, Sayaji Baug, and Pavagadh.

### 2. `ScheduleView` (`/pages/ScheduleView.jsx`)
* **Comprehensive Timetable:** Displays all 32 tournament fixtures from Day 1 to Day 5.
* **Dynamic Multi-Filters:**
  * Filter by **Sport** (Cricket, Football, Volleyball, etc.)
  * Filter by **Tournament Day** (Day 1 Mon to Day 5 Fri)
  * Filter by **Playing Venue** (Main Ground, Courts 1–3, Indoor Hall, Chess Room)
  * Real-time search box to filter by hostel team name (e.g., "Narmada").
* **Match Reminders:** Interactive 🔔 bell toggle on every fixture card. Setting a reminder saves it locally and pops a toast notification ("Reminder set for 15 mins before match").

### 3. `SportsView` (`/pages/SportsView.jsx`)
* **Tournament Catalog:** Grid cards for all sports featuring Paris 2024 Olympic line-art pictograms.
* **Event Quick Specs:** Displays match format (e.g., "8-a-side · T8 knockout"), home venue, permitted squad roster size, and descriptive summary.
* **Direct Navigation:** Clicking any sport opens its dedicated in-depth `SportDetailView`.

### 4. `SportDetailView` (`/pages/SportDetailView.jsx`)
* **Sport-Specific Deep Dive:** Focused view for an individual sport (e.g., Cricket, Pickleball, Chess).
* **Official Regulations List:** Exhaustive rules governing powerplays, fouls, scoring thresholds, and referee appointments.
* **Ground & Squad Specs:** Court dimensions, ball/shuttle specifications, and equipment rules.
* **Related Match Schedule:** Filtered sub-list showing all group stage, semi-final, and final ties for that specific sport.

### 5. `VenuesView` (`/pages/VenuesView.jsx`)
* **Campus Grounds Layout:** Interactive guide to the 6 primary playing grounds:
  1. Main Ground (Cricket, Football, Tug of War)
  2. Court 1 (Kho-Kho, Throwball)
  3. Court 2 (Volleyball)
  4. Court 3 (Pickleball)
  5. Indoor Hall (Badminton, Table Tennis, Carrom)
  6. Chess Room (Quiet Zone, Rapid Chess)
* **Student Room & Bed Lookup:** Searchable directory allowing resident students to look up their assigned hostel block, room number, and bed number (e.g., `SMJV26-0142` -> Block B, Room B-214, Bed #2).
* **Helpline & Medical Desk:** Location directions to the 24/7 first aid station beside the pavilion.

### 6. `MealsView` (`/pages/MealsView.jsx`)
* **5-Day Mess Timetable:** Full dietary breakdown for all 5 festival days across Breakfast, Lunch, and Dinner.
* **Authentic Regional Menu:**
  * Day 1: Thepla with Chundo, Sev Tameta, Undhiyu, Gujarati Dal Bhaat, Paneer Tikka Masala.
  * Day 2: Fafda & Jalebi, Khaman, Dal Baati Churma, Punjabi Kadhi.
  * Day 3: Poha Sev, Idli Sambar, Special Gujarati Thali with Shrikhand, Chinese Bhel counter.
  * Day 4: Methi Paratha, Dal Tadka, Bhindi Masala, Pav Bhaji with Masala Chaas.
  * Day 5: Upma, Dhokla, Festival Thali with Basundi, Grand Closing Buffet & Kulfi.
* **Dietary Badges:** Clearly labels vegetarian dishes and "Jain on request" meal counters.

### 7. `ExploreView` (`/pages/ExploreView.jsx`)
* **Vadodara Visitor Guide:** Comprehensive sightseeing guide for visiting hostel students and alumni:
  * Laxmi Vilas Palace (Gaekwad residence, 4x size of Buckingham Palace)
  * Sayaji Baug (113-acre park, zoo, floral clock, and planetarium)
  * EME Temple (Aluminium geodesic dome built by Indian Army)
  * Champaner-Pavagadh (UNESCO World Heritage hilltop fortress)
  * Kirti Mandir & Baroda Museum
  * Statue of Unity (World's tallest monument, day trip guide)
* **Distance & Travel Guidance:** Accurate road distance from Karelibaug campus and transit tips.

### 8. `RulebookView` (`/pages/RulebookView.jsx`)
* **Official Tournament Manual:** Complete codification of rules, eligibility, walkovers, tie-breakers, protests, and disciplinary code.
* **Print Optimized (`@media print`):** Clicking "Print Rule Book" strips web navigation, buttons, and dark styling, formatting the entire manual cleanly on white paper for official committee meetings.

### 9. `NotificationsView` (`/pages/NotificationsView.jsx`)
* **Real-Time Bulletin Center:** Official broadcast updates categorized by:
  * ⏰ Match Alerts (Timings, duty desk calls)
  * 🍽️ Mess Announcements (Meal counters opening)
  * 🔄 Schedule Updates (Rain delays or pitch reassignments)
  * 📍 Venue & Security Notices
* **Read / Unread State:** Tracking unread notifications, one-click "Mark All Read", and category filters.

### 10. `NotificationSettingsView` (`/pages/NotificationSettingsView.jsx`)
* **Granular Alert Preferences:** Lets participants toggle specific notification streams on or off (e.g., receive Match & Meal alerts, mute General chatter).
* **Storage Persistence:** Custom alert preferences are remembered in `localStorage`.

### 11. `RegisterView` (`/pages/RegisterView.jsx`)
* **Student Onboarding Portal:** Hosts the 5-stage `RegistrationFlow` detailed above.
* **Interactive DOB Picker:** Provides 3 ways to enter birthdate (Day/Month/Year dropdowns, Graphical Calendar with button, Direct typing) with auto-age calculation.
* **Live Preview:** Instant feedback on valid sport combinations.

### 12. `DashboardView` (`/pages/DashboardView.jsx`)
* **Personalized Athlete Hub:**
  * Welcome greeting customized with student's first name and hostel branch.
  * Quick status bar showing hostel room & bed allocation.
  * **"My Fixtures":** Automatically filters the 32-match schedule to show only matches where the student's selected sports are playing.
  * Direct action buttons to open the official ID Card or edit registration details.

### 13. `LoginView` (`/pages/LoginView.jsx`)
* **Fast Authentication:** Quick sign-in using registered G.R. Number or Email ID and Password.
* **Cookie Memory:** Saves authentication session into browser cookies with a 365-day expiry so users never have to log in repeatedly on their personal devices.

### 14. `ContactView` (`/pages/ContactView.jsx`)
* **Key Officials Directory:** Direct phone and email cards for:
  * Festival Convenor (Dr. Mehul Trivedi)
  * Sports Secretary (Riya Patel)
  * Cultural Secretary (Aman Sheikh)
  * Hospitality & Stay Incharge (Nidhi Desai)
  * 24-Hour Emergency Control Room (+91 98250 40120)
* **Interactive FAQ Accordion:** Answers to frequent questions on kit collection, rain delays, and eligibility.

### 15. `StyleGuideView` (`/pages/StyleGuideView.jsx`)
* **Design Token Inspector:** Live demonstration of the design system:
  * Color swatches (Midnight Ground, Saffron `#FF7A1A`, Marigold `#FFC53D`, Vermilion `#FF5A4E`, Cool Paper)
  * Typography scale (Anton display, Archivo interface sans, JetBrains Mono data font, Noto Sans Gujarati)
  * Liquid glassmorphic surfaces, buttons, and state indicators.

---

## 4. Complete Festival Rules & Guidelines

### General Competition Rules

#### 1. Eligibility & Representation
* Every participant must be a bonafide resident student enrolled in one of the eight SMJV hostel branches (Vadodara, Ahmedabad, Mumbai, Bhavnagar, Surat, Pune, Rajkot, Anand) for the academic year 2026–27.
* Students must carry their official hostel photo ID card and their digital accreditation pass at every playing venue at all times.
* A player may represent one hostel branch only.
* Alumni, day scholars, and external students are strictly ineligible to compete; they may register as volunteers or visitors.

#### 2. Registration & Team Sheets
* Individual registrations close on **30 November 2026 at 6:00 PM IST** via the portal.
* Official team sheets for team disciplines must be submitted by the respective hostel sports secretary before 30 November 2026 at 6:00 PM.
* Changes to an entered squad sheet are permitted up to 24 hours prior to that team's first fixture in that discipline.
* On-the-spot individual entries are entertained on Day 1 (14 December) up to 9:00 AM only, subject to draw availability.

#### 3. Footwear, Uniform & Field Conduct
* Studs and moulded cleats are allowed exclusively on the Main Ground (grass).
* Non-marking rubber-soled shoes are strictly mandatory inside the Indoor Hall (Badminton/TT) and the Chess Room.
* Watches, chains, and jewellery must be removed or securely taped before stepping onto the court.
* Team captains must report their squad to the ground duty desk **15 minutes** before the scheduled start time.
* Replacing a registered player with an unregistered substitute results in immediate forfeiture of that match.

#### 4. Walkovers, Stoppages & Delays
* A team failing to report the minimum required players within **10 minutes** of the official call is awarded a walkover loss.
* Weather interruptions and unplayable pitch conditions are decided exclusively by the Sports Convenor.
* Power or equipment failure during indoor fixtures is treated as an official stoppage; play resumes with the exact score recorded at the moment of interruption.
* The official website schedule page and the notification bulletin are the sole authoritative channels for revised match times.

#### 5. Scoring & Points System
* All group-stage matches award **2 points for a win**, **1 point for a draw** (where applicable), and **0 points for a loss**.
* A walkover win is awarded with maximum score margin for that discipline.
* Group stage tie-breaking order:
  1. Head-to-head match result
  2. Point / Goal difference or Net Run Rate (NRR)
  3. Official coin toss supervised by the Convenor
* The Overall Hostel Championship Trophy is awarded to the branch with the highest aggregate points across all 10 sports.

#### 6. Protests, Appeals & Conduct
* Formal protests must be lodged in writing with the sports secretary within **1 hour** of match conclusion along with a nominal security deposit.
* Judgment calls by referees (e.g., line in/out, LBW, fair tackle) cannot be protested; protests are admissible only on misapplication of technical rules.
* Verbal abuse, threatening gestures, or dissent toward match officials results in immediate player suspension.
* Alcohol, tobacco, and banned substances are strictly forbidden across all hostel grounds and playing courts. Possession results in immediate disqualification and hostel disciplinary action.

---

### Sport-by-Sport Rules (10 Disciplines)

#### 1. Cricket
* **Format:** 6 overs per innings, 8 players a side. Hard tennis ball under floodlights.
* **Bowling Quota:** Maximum 2 overs per bowler. Front-foot no-balls award a Free Hit on the next delivery.
* **Powerplay:** Overs 1 & 2 are mandatory powerplay (maximum 2 fielders outside the 30-yard circle).
* **Tied Knockout:** Decided by a 1-over Super Over. If still tied, the team hitting more boundaries in the match advances.
* **Bouncer Rule:** One bouncer per over allowed; a second bouncer above shoulder height is called a no-ball.

#### 2. Football
* **Format:** 7-a-side on grass, two halves of 20 minutes with a 5-minute halftime interval.
* **Substitutions:** Rolling substitutions permitted during natural stoppages.
* **Tackles:** Slide tackles from behind result in an automatic Red Card; reckless side tackles receive a Yellow Card.
* **Tied Knockouts:** Direct penalty shootout (3 kicks per side, then sudden death).
* **Equipment:** Shin guards are mandatory for all outfield players.

#### 3. Volleyball
* **Format:** Best of 3 sets. Sets 1 & 2 to 15 points; deciding Set 3 to 15 points. Must win by 2 clear points (capped at 21).
* **Players:** 6 on court. Service rotation must be adhered to. Libero may replace any back-row defender freely.
* **Let Serves:** A serve clipping the tape and landing inside the opponent's boundary remains live in play.
* **Time-outs:** Each team is entitled to two 30-second time-outs per set.

#### 4. Pickleball
* **Format:** Doubles only. Single game to 11 points (win by 2) in group stage; best of 3 games in semi-finals and final.
* **Service:** Underhand serve only, paddle contact below the waist, struck diagonally across court.
* **Two-Bounce Rule:** The serve must bounce once and the return of serve must bounce once before volleys are legal.
* **Non-Volley Zone (The Kitchen):** Extends 7 feet on both sides of the net. Players cannot volley while standing on or inside the kitchen line.

#### 5. Kho-Kho
* **Format:** 9 active chasers seated in alternating directions, 3 runners enter the field at a time in fixed order.
* **Innings:** Two turns of 7 minutes each for both chasing and defending sides.
* **The "Kho":** Must be given from behind with an audible verbal "Kho". A silent touch or frontal touch is a foul.
* **Direction:** Chasers cannot change their chosen direction of run without giving a Kho.

#### 6. Throwball
* **Format:** 6-a-side on court. Best of 3 sets to 15 points (win by 2, cap at 21).
* **Catch & Throw:** Clean two-handed catches only. Ball cannot be held against the chest or body.
* **Release Limit:** The ball must be released within 3 seconds of catching; walking or running with the ball is a foul.
* **Net Violations:** Touching the net or crossing the center court plane is an automatic fault.

#### 7. Tug of War
* **Format:** 8 pullers on the rope with 2 reserves. Best of 3 pulls.
* **Winning Mark:** The center red marker on the rope must cross 4 meters from the initial center line.
* **Lanes:** Feet must remain strictly outside the lane boundary lines (60 cm from the rope).
* **Anchor:** The last puller (anchor) may wrap the rope around their torso once only; knotting or looping around legs is illegal.
* **Stoppage:** Pulls exceeding 5 minutes without a decision are declared dead and re-pulled.

#### 8. Badminton
* **Format:** 5 rubbers per team tie (3 Singles + 2 Doubles). First to 3 rubbers wins the tie.
* **Scoring:** Rubbers are best of 3 games to 15 points (win by 2, cap at 17).
* **Fifth Rubber:** If reached, the 5th rubber is always played out for tournament points aggregate.
* **Shuttles:** Feather shuttles supplied exclusively by the tournament committee.

#### 9. Table Tennis
* **Format:** 5 rubbers per tie (4 Singles + 1 Doubles).
* **Scoring:** Best of 5 games to 11 points (win by 2). Service alternates every 2 points.
* **Rackets:** Must carry two different colored rubbers (standard red and black ITTF approved).
* **Service:** Ball must rest freely on an open palm and be tossed upward at least 16 cm before striking.

#### 10. Chess
* **Format:** 4-board rapid team match.
* **Time Control:** 10 minutes per player with a 5-second increment per move (FIDE Rapid).
* **Touch-Move:** Touching a piece with intent to move obliges the player to move it if legal.
* **Electronic Devices:** Mobile phones and smart watches must remain powered off outside the room. An audible phone forfeits that board immediately.

#### 11. Carrom
* **Format:** Singles & Doubles ties, played up to 29 points or 8 boards.
* **The Queen:** Carries 3 points and must be "covered" by pocketing another carrom man on the immediate subsequent stroke.
* **Fouls:** Pocketing the striker incurs a penalty of one carrom man returned to the center circle.

---

## 5. Compartmentalization & Fault Tolerance Strategy

To guarantee that the portal never crashes as a whole:
1. **Isolated Module Boundaries:**
   * Every page view is housed in its own isolated file under `src/pages/`.
   * Common primitives and utilities are decoupled under `src/components/common/` and `src/utils/`.
2. **React Error Boundaries on Every Route:**
   * In `src/App.jsx`, each route view (`<HomeView />`, `<ScheduleView />`, `<RegistrationFlow />`, etc.) is individually wrapped inside a dedicated `<ErrorBoundary name="...">`.
   * **Fault Isolation Guarantee:** If a runtime exception occurs inside the `MealsView` or a photo fails to render in `DashboardView`, only that specific container displays a graceful recovery card with a **[🔄 Reload Section]** button. The navigation header, theme toggle, footer, and all other 14 pages remain 100% operational!
3. **Decoupled Data Store:**
   * `src/data/tournamentData.js` supplies immutable festival data, preventing cross-component state contamination.

---

## 6. Tech Stack & Getting Started

### Tech Stack
* **Framework:** React 18.3.1 (Modern functional components, hooks, custom boundaries)
* **Build System:** Vite 5.4+ with `@vitejs/plugin-react`
* **Styling:** Tailwind CSS 3.4+ & PostCSS with liquid glassmorphism utility classes
* **QR Engine:** Self-contained pure JavaScript/SVG QR Code generator (0 external dependencies)
* **State & Persistence:** React State + Browser Cookies (`SameSite=Lax`, 365-day expiry) + `localStorage` fallback

### Getting Started

```powershell
# 1. Navigate to the project directory
cd "Responsive-Mobile-first-Website-Inter-Smjv-2026"

# 2. Install dependencies (if running for the first time)
npm install

# 3. Start development server
npm run dev

# 4. Open the printed localhost URL in your browser (e.g. http://localhost:3000)
```

To build for production:
```powershell
npm run build
npm run preview
```

---
**INTER SMJV 2026** · *Shree Mahavira Jaina Vidyalaya, Vadodara*  
*For emergencies or match queries, contact the 24-Hour Duty Desk on +91 98250 40120.*
