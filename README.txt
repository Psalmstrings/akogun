===================================================================
AKOGUN SURVEYING & ENVIRONMENTAL CONSULTANCY (AKOGUN SEC)
ENTERPRISE MULTI-PAGE PLATFORM & CLOUD-POWERED ADMIN DASHBOARD
===================================================================

OFFICIAL ADMIN CREDENTIALS
- Admin URL: Open `admin.html` in any browser or click "⚙ Admin" in the header / footer.
- Admin Email: `admin@akogunsec.com`
- Admin Password: `AkogunSec@2026!`
(Account is registered and active in Firebase Auth. Local passkey `akogun2026` is also supported as instant fallback).

CONNECTED CLOUD CONFIGURATION
1. FIREBASE AUTH & FIRESTORE
   - Web App API Key: AIzaSyBqm5lUUEtSjkeeUt4pbqH0TbUloOmMon0
   - Auth Domain: akogunsec-50335.firebaseapp.com
   - Project ID: akogunsec-50335
   - Storage Bucket: akogunsec-50335.firebasestorage.app
   - Messaging Sender ID: 305487731039
   - App ID: 1:305487731039:web:b3a3f5edea0601debf3eea

2. CLOUDINARY MEDIA STORAGE
   - Cloud Name: dd5p5t2rs
   - API Key: 826945982469187
   - API Secret: SL7mJQ4hfKzyBz4ssprbQGZLZO0
   - Default Upload Preset: akogun_preset
   *Note: If you wish to allow direct browser uploads without API secret restrictions, open Cloudinary Settings -> Upload -> Add upload preset -> set Signing Mode to "Unsigned" and name it "akogun_preset". The app also supports direct image links and automatic local fallback.*

MULTI-PAGE PLATFORM STRUCTURE
1. index.html       : Modern high-converting homepage (hero carousel, founder spotlight, services, portfolio, onsite gallery, WhatsApp enquiry).
2. about.html       : Detailed About Us page (history, credentials of Surv. Adediji Babatunde, core values, mission & vision).
3. services.html    : In-depth breakdown of 7 practice areas, 4-step workflow, and client FAQ accordion.
4. team.html        : Our Team page presenting Field Geomatics, GIS/Cartography, and Title Perfection divisions.
5. projects.html    : Dynamic Portfolio page connected to Firebase Firestore and Cloudinary with live search, category filtering, and interactive project modal.
6. contact.html     : Dedicated contact hub with immediate WhatsApp enquiry generation and automatic lead capture into the Admin Dashboard.
7. admin.html       : Secure executive dashboard (Projects CRUD, Leads Inbox, Company Settings, Cloud Config).

HOW TO RUN LOCALLY
- Double click `index.html` or open the project folder with VS Code Live Server.
