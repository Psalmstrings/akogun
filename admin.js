/**
 * AKOGUN SEC - Admin Dashboard Application Logic
 * Integrates Cloudinary Uploads, Firebase Firestore,
 * and System Controls.
 */

"use strict";

class AdminApp {
  constructor() {
    this.store = window.AkogunDataStore;
    this.currentProjects = [];
    this.currentInquiries = [];
    this.editingProjectId = null;
    this.selectedFile = null;

    this.initElements();
    this.initEventListeners();
    this.checkAuth();
  }

  initElements() {
    // Auth elements
    this.loginWrapper = document.getElementById("loginWrapper");
    this.loginForm = document.getElementById("loginForm");
    this.adminPassInput = document.getElementById("adminPass");
    this.logoutBtn = document.getElementById("logoutBtn");

    // Navigation elements
    this.sidebar = document.getElementById("adminSidebar");
    this.menuToggleBtn = document.getElementById("menuToggleBtn");
    this.navItems = document.querySelectorAll(".sidebar-nav-item");
    this.views = {
      dashboardView: document.getElementById("dashboardView"),
      projectsView: document.getElementById("projectsView"),
      inquiriesView: document.getElementById("inquiriesView"),
      settingsView: document.getElementById("settingsView"),
      cloudView: document.getElementById("cloudView")
    };
    this.pageHeading = document.getElementById("pageHeading");

    // Stats elements
    this.statProjectsCount = document.getElementById("statProjectsCount");
    this.statInquiriesCount = document.getElementById("statInquiriesCount");
    this.statCloudinary = document.getElementById("statCloudinary");
    this.statFirebase = document.getElementById("statFirebase");

    // Tables
    this.dashboardInquiriesTbody = document.getElementById("dashboardInquiriesTbody");
    this.projectsTableBody = document.getElementById("projectsTableBody");
    this.inquiriesTableBody = document.getElementById("inquiriesTableBody");

    // Project Modal
    this.projectModal = document.getElementById("projectModal");
    this.openAddProjectModalBtn = document.getElementById("openAddProjectModalBtn");
    this.closeProjectModalBtn = document.getElementById("closeProjectModalBtn");
    this.cancelProjectBtn = document.getElementById("cancelProjectBtn");
    this.projectForm = document.getElementById("projectForm");
    this.modalHeading = document.getElementById("modalHeading");

    // Cloudinary Upload elements
    this.dropzone = document.getElementById("dropzone");
    this.fileInput = document.getElementById("fileInput");
    this.previewContainer = document.getElementById("previewContainer");
    this.imagePreview = document.getElementById("imagePreview");
    this.progressBar = document.getElementById("progressBar");
    this.progressFill = document.getElementById("progressFill");
    this.imageUrlInput = document.getElementById("imageUrlInput");

    // Project Form Fields
    this.projectId = document.getElementById("projectId");
    this.projectTitle = document.getElementById("projectTitle");
    this.projectCategory = document.getElementById("projectCategory");
    this.projectStatus = document.getElementById("projectStatus");
    this.projectLocation = document.getElementById("projectLocation");
    this.projectYear = document.getElementById("projectYear");
    this.projectDescription = document.getElementById("projectDescription");
    this.projectFeatured = document.getElementById("projectFeatured");

    // Settings Forms
    this.settingsForm = document.getElementById("settingsForm");
    this.settingWhatsApp = document.getElementById("settingWhatsApp");
    this.settingPhone = document.getElementById("settingPhone");
    this.settingEmail1 = document.getElementById("settingEmail1");
    this.settingEmail2 = document.getElementById("settingEmail2");
    this.settingHours = document.getElementById("settingHours");

    // Cloud Config Form
    this.cloudConfigForm = document.getElementById("cloudConfigForm");
    this.cloudNameInput = document.getElementById("cloudName");
    this.uploadPresetInput = document.getElementById("uploadPreset");
    this.fbApiKey = document.getElementById("fbApiKey");
    this.fbProjectId = document.getElementById("fbProjectId");
    this.fbAuthDomain = document.getElementById("fbAuthDomain");
    this.fbStorageBucket = document.getElementById("fbStorageBucket");
    this.fbAppId = document.getElementById("fbAppId");

    // Toasts
    this.toastContainer = document.getElementById("toastContainer");
  }

  initEventListeners() {
    // Login Submit
    if (this.loginForm) {
      this.loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const pass = this.adminPassInput.value.trim();
        if (this.store.loginAdminLocally(pass)) {
          this.loginWrapper.style.display = "none";
          this.showToast("Signed in successfully. Welcome Surv. Babatunde!", "success");
          this.loadDashboardData();
        } else {
          this.showToast("Invalid administrative passcode. Please retry.", "error");
        }
      });
    }

    // Logout
    if (this.logoutBtn) {
      this.logoutBtn.addEventListener("click", () => {
        this.store.logoutAdmin();
        window.location.reload();
      });
    }

    // Mobile Sidebar Toggle
    if (this.menuToggleBtn) {
      this.menuToggleBtn.addEventListener("click", () => {
        this.sidebar.classList.toggle("open");
      });
    }

    // Navigation item click
    this.navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const targetView = item.dataset.view;
        this.switchView(targetView);
        if (window.innerWidth <= 768) {
          this.sidebar.classList.remove("open");
        }
      });
    });

    // Project Modal Open/Close
    if (this.openAddProjectModalBtn) {
      this.openAddProjectModalBtn.addEventListener("click", () => this.openProjectModal());
    }
    if (this.closeProjectModalBtn) {
      this.closeProjectModalBtn.addEventListener("click", () => this.closeProjectModal());
    }
    if (this.cancelProjectBtn) {
      this.cancelProjectBtn.addEventListener("click", () => this.closeProjectModal());
    }

    // Cloudinary Dropzone Click & Drag
    if (this.dropzone && this.fileInput) {
      this.dropzone.addEventListener("click", () => this.fileInput.click());

      this.fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleFileSelected(e.target.files[0]);
        }
      });

      this.dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        this.dropzone.classList.add("dragover");
      });

      this.dropzone.addEventListener("dragleave", () => {
        this.dropzone.classList.remove("dragover");
      });

      this.dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        this.dropzone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleFileSelected(e.dataTransfer.files[0]);
        }
      });
    }

    // Project Form Submit
    if (this.projectForm) {
      this.projectForm.addEventListener("submit", (e) => this.handleProjectSubmit(e));
    }

    // Settings Form Submit
    if (this.settingsForm) {
      this.settingsForm.addEventListener("submit", (e) => this.handleSettingsSubmit(e));
    }

    // Cloud Config Form Submit
    if (this.cloudConfigForm) {
      this.cloudConfigForm.addEventListener("submit", (e) => this.handleCloudConfigSubmit(e));
    }
  }

  checkAuth() {
    if (this.store.isAdminLoggedIn()) {
      this.loginWrapper.style.display = "none";
      this.loadDashboardData();
    } else {
      this.loginWrapper.style.display = "grid";
    }
  }

  switchView(viewName) {
    // Update nav active
    this.navItems.forEach((item) => {
      item.classList.toggle("active", item.dataset.view === viewName);
    });

    // Update view visibility
    Object.keys(this.views).forEach((key) => {
      if (this.views[key]) {
        this.views[key].style.display = key === viewName ? "block" : "none";
      }
    });

    // Update Heading
    const titles = {
      dashboardView: "Dashboard Overview",
      projectsView: "Projects & Portfolio Management",
      inquiriesView: "Client Inquiries & Project Briefs",
      settingsView: "Company Contact Settings",
      cloudView: "Cloud Integrations (Firebase & Cloudinary)"
    };
    if (this.pageHeading) {
      this.pageHeading.textContent = titles[viewName] || "Dashboard";
    }

    // Refresh data if needed
    if (viewName === "projectsView") this.loadProjects();
    if (viewName === "inquiriesView") this.loadInquiries();
    if (viewName === "settingsView") this.populateSettings();
    if (viewName === "cloudView") this.populateCloudConfig();
  }

  async loadDashboardData() {
    await Promise.all([this.loadProjects(), this.loadInquiries()]);

    if (this.statProjectsCount) {
      this.statProjectsCount.textContent = this.currentProjects.length;
    }
    if (this.statInquiriesCount) {
      this.statInquiriesCount.textContent = this.currentInquiries.length;
    }

    // Cloud status indicators
    if (this.statFirebase) {
      this.statFirebase.textContent = this.store.db ? "Connected (Firebase)" : "Active (Local Store)";
      this.statFirebase.style.color = this.store.db ? "#16a34a" : "#073b7a";
    }
    if (this.statCloudinary) {
      const cName = this.store.config.cloudinary.cloudName;
      this.statCloudinary.textContent = cName ? `Ready (${cName})` : "Configure in Cloud";
    }

    // Render Recent Inquiries on dashboard
    if (this.dashboardInquiriesTbody) {
      const recent = this.currentInquiries.slice(0, 5);
      if (recent.length === 0) {
        this.dashboardInquiriesTbody.innerHTML = `
          <tr><td colspan="5" style="text-align: center; color: var(--admin-text-muted);">No inquiries received yet.</td></tr>
        `;
      } else {
        this.dashboardInquiriesTbody.innerHTML = recent
          .map((inq) => {
            const dateStr = new Date(inq.createdAt || Date.now()).toLocaleDateString();
            const badgeClass = inq.status === "Resolved" ? "badge-success" : inq.status === "Contacted" ? "badge-blue" : "badge-warning";
            return `
              <tr>
                <td>${dateStr}</td>
                <td><strong>${inq.name}</strong></td>
                <td>${inq.email}</td>
                <td><span class="badge badge-blue">${inq.service}</span></td>
                <td><span class="badge ${badgeClass}">${inq.status || "New"}</span></td>
              </tr>
            `;
          })
          .join("");
      }
    }
  }

  // ==========================================
  // PROJECTS MANAGEMENT
  // ==========================================

  async loadProjects() {
    try {
      this.currentProjects = await this.store.getProjects();
      this.renderProjectsTable();
    } catch (e) {
      console.error("Failed to load projects:", e);
      this.showToast("Failed to load projects.", "error");
    }
  }

  renderProjectsTable() {
    if (!this.projectsTableBody) return;

    if (this.currentProjects.length === 0) {
      this.projectsTableBody.innerHTML = `
        <tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted);">No projects found. Click "+ Add New Project" to get started.</td></tr>
      `;
      return;
    }

    this.projectsTableBody.innerHTML = this.currentProjects
      .map((p) => {
        const catLabel = p.categoryLabel || p.category.toUpperCase();
        const statusBadge = p.status === "Completed" ? "badge-success" : "badge-warning";
        return `
          <tr>
            <td>
              <img src="${p.imageUrl || "images/site-work.jpeg"}" class="project-thumb" alt="${p.title}" />
            </td>
            <td>
              <strong>${p.title}</strong>
              ${p.featured ? '<span class="badge badge-warning" style="margin-left: 6px;">Featured</span>' : ""}
            </td>
            <td><span class="badge badge-blue">${catLabel}</span></td>
            <td>${p.location || "Nigeria"}</td>
            <td>${p.year || "2025"}</td>
            <td><span class="badge ${statusBadge}">${p.status || "Completed"}</span></td>
            <td>
              <button class="btn-primary btn-sm" onclick="adminApp.editProject('${p.id}')">Edit</button>
              <button class="btn-danger-outline btn-sm" onclick="adminApp.deleteProject('${p.id}')">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  openProjectModal(project = null) {
    this.projectForm.reset();
    this.selectedFile = null;
    this.previewContainer.style.display = "none";
    this.progressBar.style.display = "none";
    this.progressFill.style.width = "0%";

    if (project) {
      this.editingProjectId = project.id;
      this.modalHeading.textContent = "Edit Project: " + project.title;
      this.projectId.value = project.id;
      this.projectTitle.value = project.title;
      this.projectCategory.value = project.category;
      this.projectStatus.value = project.status || "Completed";
      this.projectLocation.value = project.location || "";
      this.projectYear.value = project.year || "";
      this.projectDescription.value = project.description || "";
      this.projectFeatured.checked = !!project.featured;
      this.imageUrlInput.value = project.imageUrl || "";

      if (project.imageUrl) {
        this.imagePreview.src = project.imageUrl;
        this.previewContainer.style.display = "block";
      }
    } else {
      this.editingProjectId = null;
      this.modalHeading.textContent = "Add New Portfolio Project";
      this.projectId.value = "";
    }

    this.projectModal.classList.add("is-active");
  }

  closeProjectModal() {
    this.projectModal.classList.remove("is-active");
  }

  async handleFileSelected(file) {
    this.selectedFile = file;

    // Show instant local preview
    try {
      const dataUrl = await this.store.readFileAsDataURL(file);
      this.imagePreview.src = dataUrl;
      this.previewContainer.style.display = "block";
    } catch (e) {
      console.warn("Could not preview file:", e);
    }
  }

  async handleProjectSubmit(e) {
    e.preventDefault();
    const saveBtn = document.getElementById("saveProjectBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Uploading & Saving...";

    try {
      let finalImageUrl = this.imageUrlInput.value.trim();

      // If a new image was selected, upload directly to Cloudinary
      if (this.selectedFile) {
        this.progressBar.style.display = "block";
        this.progressFill.style.width = "0%";

        try {
          this.showToast("Uploading project image to Cloudinary...", "warning");
          const uploadRes = await this.store.uploadToCloudinary(
            this.selectedFile,
            (percent) => {
              this.progressFill.style.width = percent + "%";
            }
          );
          finalImageUrl = uploadRes.url;
          this.imageUrlInput.value = finalImageUrl;
          this.showToast("Cloudinary image upload complete!", "success");
        } catch (uploadErr) {
          console.warn("Cloudinary upload failed; falling back to local/cached image:", uploadErr);
          this.showToast("Cloudinary: " + uploadErr.message + " (Saved image locally)", "warning");
          // Fallback to data URL preview so save still succeeds
          if (!finalImageUrl && this.imagePreview.src) {
            finalImageUrl = this.imagePreview.src;
          }
        }
      }

      if (!finalImageUrl) {
        finalImageUrl = "images/site-work.jpeg";
      }

      // Format category label
      const catLabels = {
        surveying: "Land Surveying",
        estate: "Estate Development",
        construction: "Construction Management",
        property: "Property Services",
        environmental: "Environmental Consultancy"
      };

      const projectData = {
        id: this.editingProjectId || undefined,
        title: this.projectTitle.value.trim(),
        category: this.projectCategory.value,
        categoryLabel: catLabels[this.projectCategory.value] || this.projectCategory.value,
        status: this.projectStatus.value,
        location: this.projectLocation.value.trim(),
        year: this.projectYear.value.trim(),
        description: this.projectDescription.value.trim(),
        featured: this.projectFeatured.checked,
        imageUrl: finalImageUrl
      };

      await this.store.saveProject(projectData);
      this.showToast("Project successfully saved & published to website!", "success");
      this.closeProjectModal();
      await this.loadProjects();
      this.loadDashboardData();
    } catch (err) {
      console.error("Failed to save project:", err);
      this.showToast("Error saving project: " + err.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save & Publish Project";
    }
  }

  editProject(id) {
    const project = this.currentProjects.find((p) => p.id === id);
    if (project) {
      this.openProjectModal(project);
    }
  }

  async deleteProject(id) {
    if (confirm("Are you sure you want to delete this project? This will remove it from the live portfolio.")) {
      try {
        await this.store.deleteProject(id);
        this.showToast("Project deleted successfully.", "success");
        await this.loadProjects();
        this.loadDashboardData();
      } catch (err) {
        this.showToast("Failed to delete project: " + err.message, "error");
      }
    }
  }

  // ==========================================
  // INQUIRIES MANAGEMENT
  // ==========================================

  async loadInquiries() {
    try {
      this.currentInquiries = await this.store.getInquiries();
      this.renderInquiriesTable();
    } catch (e) {
      console.error("Failed to load inquiries:", e);
    }
  }

  renderInquiriesTable() {
    if (!this.inquiriesTableBody) return;

    if (this.currentInquiries.length === 0) {
      this.inquiriesTableBody.innerHTML = `
        <tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted);">No inquiries recorded yet.</td></tr>
      `;
      return;
    }

    this.inquiriesTableBody.innerHTML = this.currentInquiries
      .map((inq) => {
        const dateStr = new Date(inq.createdAt || Date.now()).toLocaleString();
        const badgeClass = inq.status === "Resolved" ? "badge-success" : inq.status === "Contacted" ? "badge-blue" : "badge-warning";
        return `
          <tr>
            <td>${dateStr}</td>
            <td><strong>${inq.name}</strong></td>
            <td><a href="mailto:${inq.email}" style="color: var(--admin-primary);">${inq.email}</a></td>
            <td><span class="badge badge-blue">${inq.service}</span></td>
            <td style="max-width: 280px; font-size: 12px; color: var(--admin-text-muted);">${inq.message}</td>
            <td><span class="badge ${badgeClass}">${inq.status || "New"}</span></td>
            <td>
              <button class="btn-primary btn-sm" onclick="adminApp.updateInquiry('${inq.id}', 'Contacted')">Contacted</button>
              <button class="btn-accent btn-sm" onclick="adminApp.updateInquiry('${inq.id}', 'Resolved')">Resolve</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  async updateInquiry(id, status) {
    await this.store.updateInquiryStatus(id, status);
    this.showToast(`Inquiry marked as ${status}.`, "success");
    await this.loadInquiries();
  }

  // ==========================================
  // SETTINGS & CLOUD CONFIG
  // ==========================================

  populateSettings() {
    const site = this.store.config.site || {};
    this.settingWhatsApp.value = site.whatsappNumber || "2348064825656";
    this.settingPhone.value = site.phoneDisplay || "+234 806 482 5656";
    this.settingEmail1.value = site.emailPrimary || "akogunsec@gmail.com";
    this.settingEmail2.value = site.emailSecondary || "babatunde4real@gmail.com";
    this.settingHours.value = site.officeHours || "Monday – Saturday: 8:00 AM – 6:00 PM";
  }

  handleSettingsSubmit(e) {
    e.preventDefault();
    this.store.saveConfig({
      site: {
        whatsappNumber: this.settingWhatsApp.value.trim(),
        phoneDisplay: this.settingPhone.value.trim(),
        emailPrimary: this.settingEmail1.value.trim(),
        emailSecondary: this.settingEmail2.value.trim(),
        officeHours: this.settingHours.value.trim()
      }
    });
    this.showToast("Company settings updated successfully!", "success");
  }

  populateCloudConfig() {
    const cloud = this.store.config.cloudinary || {};
    const fb = this.store.config.firebase || {};

    this.cloudNameInput.value = cloud.cloudName || "";
    this.uploadPresetInput.value = cloud.uploadPreset || "";

    this.fbApiKey.value = fb.apiKey || "";
    this.fbProjectId.value = fb.projectId || "";
    this.fbAuthDomain.value = fb.authDomain || "";
    this.fbStorageBucket.value = fb.storageBucket || "";
    this.fbAppId.value = fb.appId || "";
  }

  handleCloudConfigSubmit(e) {
    e.preventDefault();
    this.store.saveConfig({
      cloudinary: {
        cloudName: this.cloudNameInput.value.trim(),
        uploadPreset: this.uploadPresetInput.value.trim()
      },
      firebase: {
        apiKey: this.fbApiKey.value.trim(),
        projectId: this.fbProjectId.value.trim(),
        authDomain: this.fbAuthDomain.value.trim(),
        storageBucket: this.fbStorageBucket.value.trim(),
        appId: this.fbAppId.value.trim()
      }
    });
    this.showToast("Cloud configuration saved. Re-initializing cloud connections...", "success");
    this.loadDashboardData();
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================

  showToast(message, type = "info") {
    if (!this.toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Instantiate globally
window.adminApp = new AdminApp();
