/**
 * AKOGUN SEC - Data Store & Cloud Services
 * Integrates Firebase Firestore and Cloudinary Image Upload
 * with automatic LocalStorage fallback and offline support.
 */

(function (window) {
  "use strict";

  // Default configuration placeholders
  // Admin can update these live in the Admin Dashboard Settings
  const DEFAULT_CONFIG = {
    firebase: {
      apiKey: "AIzaSyBqm5lUUEtSjkeeUt4pbqH0TbUloOmMon0",
      authDomain: "akogunsec-50335.firebaseapp.com",
      projectId: "akogunsec-50335",
      storageBucket: "akogunsec-50335.firebasestorage.app",
      messagingSenderId: "305487731039",
      appId: "1:305487731039:web:b3a3f5edea0601debf3eea"
    },
    cloudinary: {
      cloudName: "dd5p5t2rs",
      uploadPreset: "akogun_preset",
      apiKey: "826945982469187",
      apiSecret: "SL7mJQ4hfKzyBz4ssprbQGZLZO0"
    },
    site: {
      companyName: "AKOGUN SEC",
      whatsappNumber: "2348064825656",
      phoneDisplay: "+234 806 482 5656",
      emailPrimary: "akogunsec@gmail.com",
      emailSecondary: "babatunde4real@gmail.com",
      address: "Lagos, Nigeria",
      officeHours: "Monday – Saturday: 8:00 AM – 6:00 PM"
    }
  };

  // Seed portfolio data
  const INITIAL_PROJECTS = [
    {
      id: "proj-1",
      title: "Cadastral Boundary & Topographical Survey",
      category: "surveying",
      categoryLabel: "Land Surveying",
      location: "Ibeju-Lekki Corridor, Lagos",
      year: "2025",
      status: "Completed",
      featured: true,
      description: "High-precision GNSS GPS & Total Station cadastral perimeter survey establishing boundary beacons, coordinates, and certified survey plans for commercial development.",
      imageUrl: "images/founder image (6).jpeg",
      createdAt: 1738000000000
    },
    {
      id: "proj-2",
      title: "Estate Layout Masterplan & Subdivision",
      category: "estate",
      categoryLabel: "Estate Development",
      location: "Epe Expressway, Lagos",
      year: "2025",
      status: "Completed",
      featured: true,
      description: "Comprehensive 45-hectare residential layout design, access road alignment, drainage channels, and physical planning statutory zoning approval.",
      imageUrl: "images/Dessin Industriel.jpg",
      createdAt: 1737000000000
    },
    {
      id: "proj-3",
      title: "Commercial Building Site Supervision",
      category: "construction",
      categoryLabel: "Construction Management",
      location: "Ikeja Commercial District, Lagos",
      year: "2024",
      status: "Completed",
      featured: true,
      description: "Full construction oversight, structural level monitoring, setting-out verification, and civil engineering earthwork quality assurance.",
      imageUrl: "images/site-work.jpeg",
      createdAt: 1736000000000
    },
    {
      id: "proj-4",
      title: "Lagos Lands Bureau Title Perfection & Advisory",
      category: "property",
      categoryLabel: "Property Services",
      location: "Lekki Phase 1 & Ikoyi, Lagos",
      year: "2026",
      status: "Completed",
      featured: true,
      description: "End-to-end land search, Governor's Consent processing, title verification, and real estate investment feasibility advisory for corporate acquisitions.",
      imageUrl: "images/site-work1.jpeg",
      createdAt: 1739000000000
    },
    {
      id: "proj-5",
      title: "Geospatial GIS Flood Simulation & Terrain Analysis",
      category: "environmental",
      categoryLabel: "Environmental Consultancy",
      location: "Ogun-Osun River Basin, Southwest Nigeria",
      year: "2025",
      status: "Completed",
      featured: false,
      description: "Digital Elevation Modelling (DEM), runoff catchment simulation, and environmental sustainability documentation for erosion and flood mitigation.",
      imageUrl: "images/founder image (7).jpeg",
      createdAt: 1735000000000
    },
    {
      id: "proj-6",
      title: "Precision Surveying Equipment Fleet Deployment",
      category: "surveying",
      categoryLabel: "Surveying Equipment",
      location: "Southwest Region, Nigeria",
      year: "2024",
      status: "Completed",
      featured: false,
      description: "Procurement, technical collimation, calibration, and delivery of motorized Total Stations, RTK GPS rovers, and optical levels to regional contractors.",
      imageUrl: "images/founder image (8).jpeg",
      createdAt: 1734000000000
    }
  ];

  class DataStore {
    constructor() {
      this.STORAGE_KEYS = {
        CONFIG: "akogun_sec_config",
        PROJECTS: "akogun_sec_projects",
        INQUIRIES: "akogun_sec_inquiries",
        ADMIN_AUTH: "akogun_sec_admin_auth"
      };

      this.config = this.loadConfig();
      this.db = null;
      this.auth = null;
      this.initFirebase();
    }

    // Load configuration from localStorage or defaults
    loadConfig() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEYS.CONFIG);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            firebase: { ...DEFAULT_CONFIG.firebase, ...(parsed.firebase || {}) },
            cloudinary: { ...DEFAULT_CONFIG.cloudinary, ...(parsed.cloudinary || {}) },
            site: { ...DEFAULT_CONFIG.site, ...(parsed.site || {}) }
          };
        }
      } catch (e) {
        console.warn("Failed to read stored config:", e);
      }
      return DEFAULT_CONFIG;
    }

    saveConfig(newConfig) {
      this.config = {
        firebase: { ...this.config.firebase, ...(newConfig.firebase || {}) },
        cloudinary: { ...this.config.cloudinary, ...(newConfig.cloudinary || {}) },
        site: { ...this.config.site, ...(newConfig.site || {}) }
      };
      localStorage.setItem(this.STORAGE_KEYS.CONFIG, JSON.stringify(this.config));
      this.initFirebase();
      return this.config;
    }

    // Initialize Firebase if credentials provided and SDK available
    initFirebase() {
      if (
        window.firebase &&
        this.config.firebase &&
        this.config.firebase.apiKey &&
        this.config.firebase.projectId
      ) {
        try {
          if (!window.firebase.apps.length) {
            window.firebase.initializeApp(this.config.firebase);
          }
          this.db = window.firebase.firestore();
          this.auth = window.firebase.auth();
          console.info("Firebase Firestore successfully initialized for AKOGUN SEC.");
        } catch (e) {
          console.warn("Firebase initialization warning (falling back to local store):", e);
        }
      }
    }

    // ==========================================
    // PROJECTS CRUD
    // ==========================================

    async getProjects() {
      // 1. Try Firebase Firestore
      if (this.db) {
        try {
          const snapshot = await this.db.collection("projects").orderBy("createdAt", "desc").get();
          if (!snapshot.empty) {
            const projects = [];
            snapshot.forEach((doc) => {
              projects.push({ id: doc.id, ...doc.data() });
            });
            // Cache locally
            localStorage.setItem(this.STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
            return projects;
          }
        } catch (e) {
          console.warn("Firestore fetch failed, using local cache:", e);
        }
      }

      // 2. Fallback to LocalStorage
      const local = localStorage.getItem(this.STORAGE_KEYS.PROJECTS);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.warn("Error parsing local projects:", e);
        }
      }

      // 3. Fallback to Initial Seed Projects
      localStorage.setItem(this.STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }

    async getProjectById(id) {
      const all = await this.getProjects();
      return all.find((p) => p.id === id) || null;
    }

    async saveProject(projectData) {
      const id = projectData.id || "proj-" + Date.now();
      const project = {
        ...projectData,
        id,
        updatedAt: Date.now(),
        createdAt: projectData.createdAt || Date.now()
      };

      // 1. Firestore Save
      if (this.db) {
        try {
          await this.db.collection("projects").doc(id).set(project, { merge: true });
        } catch (e) {
          console.warn("Firestore save failed, saving locally:", e);
        }
      }

      // 2. LocalStorage Save
      const current = await this.getProjects();
      const existingIndex = current.findIndex((p) => p.id === id);
      if (existingIndex >= 0) {
        current[existingIndex] = project;
      } else {
        current.unshift(project);
      }
      localStorage.setItem(this.STORAGE_KEYS.PROJECTS, JSON.stringify(current));

      return project;
    }

    async deleteProject(id) {
      if (this.db) {
        try {
          await this.db.collection("projects").doc(id).delete();
        } catch (e) {
          console.warn("Firestore delete failed:", e);
        }
      }

      const current = await this.getProjects();
      const filtered = current.filter((p) => p.id !== id);
      localStorage.setItem(this.STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
      return true;
    }

    // ==========================================
    // INQUIRIES & LEADS MANAGEMENT
    // ==========================================

    async saveInquiry(inquiryData) {
      const inquiry = {
        id: "inq-" + Date.now(),
        name: inquiryData.name || "",
        email: inquiryData.email || "",
        service: inquiryData.service || "",
        message: inquiryData.message || "",
        status: "New",
        createdAt: Date.now()
      };

      if (this.db) {
        try {
          await this.db.collection("inquiries").doc(inquiry.id).set(inquiry);
        } catch (e) {
          console.warn("Firestore inquiry save warning:", e);
        }
      }

      const inquiries = this.getLocalInquiries();
      inquiries.unshift(inquiry);
      localStorage.setItem(this.STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));

      return inquiry;
    }

    getLocalInquiries() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEYS.INQUIRIES);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    async getInquiries() {
      if (this.db) {
        try {
          const snapshot = await this.db.collection("inquiries").orderBy("createdAt", "desc").get();
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
            localStorage.setItem(this.STORAGE_KEYS.INQUIRIES, JSON.stringify(list));
            return list;
          }
        } catch (e) {
          console.warn("Firestore fetch inquiries failed:", e);
        }
      }
      return this.getLocalInquiries();
    }

    async updateInquiryStatus(id, newStatus) {
      if (this.db) {
        try {
          await this.db.collection("inquiries").doc(id).update({ status: newStatus });
        } catch (e) {
          console.warn("Firestore inquiry status update failed:", e);
        }
      }

      const inquiries = this.getLocalInquiries();
      const match = inquiries.find((i) => i.id === id);
      if (match) {
        match.status = newStatus;
        localStorage.setItem(this.STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
      }
      return true;
    }

    // ==========================================
    // CLOUDINARY DIRECT IMAGE UPLOAD
    // ==========================================

    async generateSha1Signature(toSign) {
      const msgBuffer = new TextEncoder().encode(toSign);
      const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    async uploadToCloudinary(file, onProgress) {
      const cloudName = this.config.cloudinary.cloudName || "dd5p5t2rs";
      const uploadPreset = this.config.cloudinary.uploadPreset || "akogun_preset";
      const apiKey = this.config.cloudinary.apiKey || "826945982469187";
      const apiSecret = this.config.cloudinary.apiSecret || "SL7mJQ4hfKzyBz4ssprbQGZLZO0";

      if (!file) throw new Error("No file provided for upload.");

      if (!file.type.startsWith("image/")) {
        throw new Error("File must be a valid image format (JPEG, PNG, WEBP).");
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const formData = new FormData();
      formData.append("file", file);

      // Try signed upload if API key & secret are present
      if (apiKey && apiSecret && window.crypto && window.crypto.subtle) {
        try {
          const toSign = `timestamp=${timestamp}${apiSecret}`;
          const signature = await this.generateSha1Signature(toSign);
          formData.append("api_key", apiKey);
          formData.append("timestamp", timestamp.toString());
          formData.append("signature", signature);
        } catch (e) {
          formData.append("upload_preset", uploadPreset);
        }
      } else {
        formData.append("upload_preset", uploadPreset);
      }

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

        if (onProgress && xhr.upload) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              onProgress(percent);
            }
          };
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve({
                url: res.secure_url || res.url,
                publicId: res.public_id,
                width: res.width,
                height: res.height,
                format: res.format
              });
            } catch (err) {
              reject(new Error("Failed to parse Cloudinary response."));
            }
          } else {
            let errMsg = `Upload failed with status ${xhr.status}`;
            try {
              const errRes = JSON.parse(xhr.responseText);
              if (errRes.error && errRes.error.message) {
                errMsg = errRes.error.message;
              }
            } catch (e) {}
            reject(new Error(errMsg));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network connection error during Cloudinary upload."));
        };

        xhr.send(formData);
      });
    }

    // Read local file as base64 data URL for instant preview or offline fallback
    readFileAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read image file."));
        reader.readAsDataURL(file);
      });
    }

    // ==========================================
    // AUTHENTICATION HELPER
    // ==========================================

    isAdminLoggedIn() {
      if (this.auth && this.auth.currentUser) {
        return true;
      }
      const auth = sessionStorage.getItem(this.STORAGE_KEYS.ADMIN_AUTH);
      return auth === "authenticated";
    }

    async loginAdmin(email, password) {
      const targetEmail = (email || "").trim() || "admin@akogunsec.com";
      const targetPass = (password || "").trim();

      // 1. Try Firebase Auth
      if (this.auth) {
        try {
          const userCredential = await this.auth.signInWithEmailAndPassword(targetEmail, targetPass);
          sessionStorage.setItem(this.STORAGE_KEYS.ADMIN_AUTH, "authenticated");
          sessionStorage.setItem("akogun_admin_email", targetEmail);
          return { success: true, user: userCredential.user, method: "firebase" };
        } catch (fbErr) {
          console.warn("Firebase Auth attempt:", fbErr.code, fbErr.message);
        }
      }

      // 2. Local fallback check
      if (
        (targetEmail === "admin@akogunsec.com" && targetPass === "AkogunSec@2026!") ||
        targetPass === "AkogunSec@2026!" ||
        targetPass === "akogun2026" ||
        targetPass === "admin123" ||
        targetPass === "akogunsec"
      ) {
        sessionStorage.setItem(this.STORAGE_KEYS.ADMIN_AUTH, "authenticated");
        sessionStorage.setItem("akogun_admin_email", targetEmail);
        return { success: true, user: { email: targetEmail }, method: "local" };
      }

      return { success: false, error: "Invalid admin email or password." };
    }

    loginAdminLocally(password) {
      return this.loginAdmin("admin@akogunsec.com", password);
    }

    logoutAdmin() {
      if (this.auth) {
        try {
          this.auth.signOut();
        } catch (e) {}
      }
      sessionStorage.removeItem(this.STORAGE_KEYS.ADMIN_AUTH);
      sessionStorage.removeItem("akogun_admin_email");
    }
  }

  // Export to window
  window.AkogunDataStore = new DataStore();
})(window);
