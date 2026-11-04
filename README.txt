===================================================================
AKOGUN SURVEYING & ENVIRONMENTAL CONSULTANCY (AKOGUN SEC)
ENTERPRISE MULTI-PAGE PLATFORM & CLOUD-POWERED ADMIN DASHBOARD
===================================================================

WEBSITE ARCHITECTURE
1. index.html       : Modern high-converting homepage featuring interactive hero carousel, founder leadership spotlight, core practice areas, filterable project highlights, onsite photography gallery, and WhatsApp contact integration.
2. about.html       : Comprehensive About Us page detailing corporate origin, core values, technical standards, mission & vision, and full credentials of Surv. Adediji Babatunde (MSc Housing Dev & Mgmt, UI / FUTA / Federal School of Surveying Oyo).
3. services.html    : In-depth breakdown of all specialized services: Land Surveying & Cadastral Mapping, GIS & Geospatial Analytics, Estate Layout & Subdivision, Engineering Construction Supervision, Environmental Consultancy (EIA), Property Title Perfection & Lands Bureau Due Diligence, and Geodetic Survey Equipment Sales. Includes a 4-step methodology and client FAQ.
4. team.html        : Our Team page presenting the Field Geomatics Crew, Digital Cartography / GIS Unit, and Property Documentation Desk, complete with authentic field photography.
5. projects.html    : Dynamic Portfolio page connected to Firebase Firestore and Cloudinary. Features instant search, category filters, and an interactive Project Detail Modal.
6. contact.html     : Dedicated contact hub with immediate WhatsApp enquiry generation, direct email routing, operating schedule, and automatic lead recording.

ADMIN DASHBOARD & CLOUD INTEGRATION
7. admin.html       : Secure administrative control center.
8. admin.css        : Executive navy-themed responsive dashboard interface with metric cards, data tables, modals, and toasts.
9. admin.js         : Administrative controllers for projects CRUD, image uploads, inquiries tracking, and cloud configuration.
10. data-store.js   : Unified abstraction layer integrating:
   - Cloudinary: Direct client-side unsigned upload (`/image/upload`) with drag-and-drop file picker and live progress bar.
   - Firebase: Real-time Cloud Firestore synchronization and Firebase Auth.
   - Offline / LocalStorage fallback: Ensures complete zero-latency operation out of the box even before cloud credentials are provided.

DEFAULT ADMIN ACCESS
- Login URL: Open `admin.html` in any browser or click "⚙ Admin" in the top bar.
- Default Passcode: `akogun2026` (also accepts `admin123` or `akogunsec`).

HOW TO CONFIGURE CLOUDINARY & FIREBASE
1. Log in to the Admin Dashboard (`admin.html`).
2. Navigate to "☁️ Cloud (Firebase & Cloudinary)" from the sidebar.
3. For Cloudinary:
   - Enter your Cloud Name (e.g. `your-cloud-name`).
   - Create an Unsigned Upload Preset in your Cloudinary Settings -> Upload tab (e.g. `akogun_projects`) and enter its name.
   - Click "Save & Connect Cloud Providers". All project images uploaded will now stream straight to your Cloudinary media library!
4. For Firebase:
   - Create a project in the Firebase Console (https://console.firebase.google.com).
   - Enable Cloud Firestore in Test or Production Mode.
   - Paste your Web App config (API Key, Project ID, Auth Domain, Storage Bucket, App ID) and save.
   - All projects and client inquiries will sync to Firebase Firestore in real time.

RUNNING LOCALLY
- Double click `index.html` or open the directory with VS Code Live Server.
