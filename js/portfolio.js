/**
 * Academic Portfolio Website JavaScript
 * Handles data loading and DOM manipulation for professor profile website
 * Optimized for performance and minimalism
 */

"use strict";

/**
 * Main Portfolio Manager Class
 * Handles all data loading and content population with performance optimizations
 */
class PortfolioManager {
  /**
   * Initialize Portfolio Manager
   */
  constructor() {
    this.data = null;
    this.cache = new Map();
    this.isLoading = false;
    this.intersectionObserver = null;
  }

  /**
   * Initialize the portfolio by loading data and populating content
   * @returns {Promise<void>}
   */
  async init() {
    try {
      this.showLoadingState();
      await this.loadData();
      this.populateAllSections();
      this.initializeMobileMenu();
      this.initializeScrollNavbar();
      this.initLazyLoading();
      this.hideLoadingState();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Show loading state for better UX
   */
  showLoadingState() {
    document.body.classList.add("loading");
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    document.body.classList.remove("loading");
  }

  /**
   * Initialize lazy loading for performance
   */
  initLazyLoading() {
    if ("IntersectionObserver" in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const section = entry.target;
              if (section.dataset.lazy && !section.dataset.loaded) {
                this.loadSection(section);
                section.dataset.loaded = "true";
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      // Observe sections that can be lazy loaded
      document.querySelectorAll("[data-lazy]").forEach((section) => {
        this.intersectionObserver.observe(section);
      });
    }
  }

  /**
   * Load data from JSON file with caching
   * @returns {Promise<void>}
   * @throws {Error} When fetch fails or response is not ok
   */
  async loadData() {
    // Check cache first
    const cacheKey = "portfolio-data";
    if (this.cache.has(cacheKey)) {
      this.data = this.cache.get(cacheKey);
      return;
    }

    const response = await fetch("data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    this.data = await response.json();

    // Validate data structure
    this.validateData();

    // Cache the data
    this.cache.set(cacheKey, this.data);
  }

  /**
   * Validate data structure to prevent errors
   */
  validateData() {
    const requiredFields = ["profile", "projects", "publications", "contact"];
    requiredFields.forEach((field) => {
      if (!this.data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    });
  }

  /**
   * Populate all sections with data - optimized loading order
   * @returns {void}
   */
  populateAllSections() {
    // Load critical content first (above the fold)
    this.populateHeader();
    this.populateProfile();

    // Load secondary content with slight delay for better perceived performance
    requestAnimationFrame(() => {
      this.populateProjects();
      this.populateCourses();
      this.populateContact();

      // Load non-critical content last
      setTimeout(() => {
        this.populatePublications();
        this.populateAwards();
        this.populateCommunity();
      }, 50);
    });
  }

  /**
   * Populate header section - simplified to show only essential info
   * @returns {void}
   */
  populateHeader() {
    const { profile } = this.data;
    this.setElementText("header-name", profile.name);
    this.setElementText("header-title", profile.title);
  }

  /**
   * Populate profile section - removed redundant name/title display
   * @returns {void}
   */
  populateProfile() {
    const { profile } = this.data;

    // Focus on unique content - bio, office, background, interests
    this.setElementText("profile-bio", profile.bio);
    this.setElementText("interests", profile.interests);

    // Office info
    const officeText = `${profile.office.faculty}, ${profile.office.department}, ${profile.office.university}, ${profile.office.address}`;
    this.setElementText("office-info", officeText);

    // Academic background
    this.populateList("academic-background", profile.academicBackground);

    // Research profile links
    this.setElementHref("scopus-link", profile.scopus);
    this.setElementHref("google-scholar-link", profile.scholar);
    this.setElementHref("sinta-link", profile.sinta);
    this.setElementHref("orcid-link", profile.orcid);
    this.setElementHref("linkedin-link", profile.linkedin);
    this.setElementHref("github-link", profile.github);
  }

  /**
   * Populate projects section
   * @returns {void}
   */
  populateProjects() {
    const container = document.getElementById("projects-container");
    const list = this.createList();

    this.data.projects.forEach((project) => {
      const content = `<strong class="text-yellow-700">${project.title}</strong> (${project.year})<br>${project.description}`;
      list.appendChild(this.createListItem(content));
    });

    container.appendChild(list);
  }

  /**
   * Populate courses section
   * @returns {void}
   */
  populateCourses() {
    // Populate desktop table
    const tbody = document.querySelector("#courses-table tbody");

    // Populate mobile card view
    const mobileContainer = document.getElementById("courses-mobile");

    this.data.courses.forEach((course) => {
      // Desktop table row
      const row = document.createElement("tr");
      row.className =
        "hover:bg-gray-50 transition-colors duration-200 even:bg-gray-50";
      row.innerHTML = `
        <td class="px-6 py-4 text-gray-800 font-medium align-top">${course.name}</td>
        <td class="px-6 py-4 text-gray-600 align-top">${course.semester}</td>
        <td class="px-6 py-4 text-gray-600 align-top">${course.description}</td>
      `;
      tbody.appendChild(row);

      // Mobile minimal view
      const mobileItem = document.createElement("div");
      mobileItem.className = "p-3";
      mobileItem.innerHTML = `
        <div class="space-y-2">
          <div>
            <strong class="text-gray-800">Course Name:</strong>
            <span class="text-gray-700">${course.name}</span>
          </div>
          <div>
            <strong class="text-gray-800">Semester/Year:</strong>
            <span class="text-gray-700">${course.semester}</span>
          </div>
          <div>
            <strong class="text-gray-800">Description:</strong>
            <span class="text-gray-700">${course.description}</span>
          </div>
        </div>
      `;
      mobileContainer.appendChild(mobileItem);
    });
  }

  /**
   * Populate publications section
   * @returns {void}
   */
  populatePublications() {
    const container = document.getElementById("publications-container");
    const list = this.createList();

    this.data.publications.forEach((pub) => {
      const citation = this.formatIEEECitation(pub);
      list.appendChild(this.createListItem(citation));
    });

    container.appendChild(list);
  }

  /**
   * Format publication in IEEE citation style
   * @param {Object} pub - Publication object
   * @returns {string} - Formatted IEEE citation
   */
  formatIEEECitation(pub) {
    let citation = "";

    // Authors
    if (pub.authors && pub.authors.length > 0) {
      citation += pub.authors.join(", ") + ", ";
    }

    // Title (bold, gold/brown color, not clickable)
    citation += `"<span class="text-yellow-700 font-bold">${pub.title}</span>," `;

    // Format based on publication type
    if (pub.type === "article") {
      // Journal article
      if (pub.journal) {
        citation += `<em>${pub.journal}</em>`;
      }
      if (pub.volume) {
        citation += `, vol. ${pub.volume}`;
      }
      if (pub.number) {
        citation += `, no. ${pub.number}`;
      }
      if (pub.pages) {
        citation += `, pp. ${pub.pages}`;
      }
      if (pub.month && pub.year) {
        const monthNames = {
          jan: "Jan.",
          feb: "Feb.",
          mar: "Mar.",
          apr: "Apr.",
          may: "May",
          jun: "Jun.",
          jul: "Jul.",
          aug: "Aug.",
          sep: "Sep.",
          oct: "Oct.",
          nov: "Nov.",
          dec: "Dec.",
        };
        citation += `, ${monthNames[pub.month.toLowerCase()] || pub.month} ${
          pub.year
        }`;
      } else if (pub.year) {
        citation += `, ${pub.year}`;
      }
    } else if (pub.type === "inproceedings") {
      // Conference paper
      if (pub.booktitle) {
        citation += `in <em>${pub.booktitle}</em>`;
      }
      if (pub.year) {
        citation += `, ${pub.year}`;
      }
      if (pub.pages) {
        citation += `, pp. ${pub.pages}`;
      }
    } else if (pub.type === "inbook") {
      // Book chapter
      if (pub.booktitle) {
        citation += `in <em>${pub.booktitle}</em>`;
      }
      if (pub.publisher) {
        citation += `, ${pub.publisher}`;
      }
      if (pub.year) {
        citation += `, ${pub.year}`;
      }
      if (pub.pages) {
        citation += `, pp. ${pub.pages}`;
      }
    }

    // Add DOI if available
    if (pub.DOI) {
      citation += `, doi: <a href="${pub.url}" target="_blank" class="text-blue-600 hover:underline break-all">${pub.DOI}</a>`;
    }

    citation += ".";
    return citation;
  }

  /**
   * Populate awards section
   * @returns {void}
   */
  populateAwards() {
    const container = document.getElementById("awards-container");
    const list = this.createList();

    this.data.awards.forEach((award) => {
      const content = `<strong class="text-yellow-700">${award.title}</strong> - ${award.organization} (${award.year})`;
      list.appendChild(this.createListItem(content));
    });

    container.appendChild(list);
  }

  /**
   * Populate community activities section
   * @returns {void}
   */
  populateCommunity() {
    const list = document.getElementById("community-activities-list");

    this.data.communityActivities.forEach((activity) => {
      const content = `${activity.title} (${activity.year})`;
      list.appendChild(this.createListItem(content));
    });
  }

  /**
   * Populate contact section
   * @returns {void}
   */
  populateContact() {
    const { contact } = this.data;

    // Email
    const emailLink = document.getElementById("contact-email");
    emailLink.href = `mailto:${contact.email}`;
    emailLink.textContent = contact.email;

    // Other contact info
    this.setElementText("contact-phone", contact.phone);
    this.setElementText("office-hours", contact.office_hours);
    this.setElementText("labs-link", contact.labs);
  }

  /**
   * Initialize mobile menu functionality
   * @returns {void}
   */
  initializeMobileMenu() {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

    if (mobileMenuButton && mobileMenu) {
      // Toggle mobile menu when button is clicked
      mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");

        // Toggle hamburger/X icon
        const icon = mobileMenuButton.querySelector("i");
        if (mobileMenu.classList.contains("hidden")) {
          icon.className = "fas fa-bars text-xl";
        } else {
          icon.className = "fas fa-times text-xl";
        }
      });

      // Close mobile menu when a link is clicked
      mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.add("hidden");
          const icon = mobileMenuButton.querySelector("i");
          icon.className = "fas fa-bars text-xl";
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (event) => {
        const isClickInsideNav =
          mobileMenuButton.contains(event.target) ||
          mobileMenu.contains(event.target);

        if (!isClickInsideNav && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
          const icon = mobileMenuButton.querySelector("i");
          icon.className = "fas fa-bars text-xl";
        }
      });
    }
  }

  /**
   * Initialize scroll-based navbar behavior for mobile
   */
  initializeScrollNavbar() {
    const mobileHomeIcon = document.getElementById("mobile-home-icon");
    const mobileProfileName = document.getElementById("mobile-profile-name");
    const header = document.querySelector("header");

    if (
      mobileHomeIcon &&
      mobileProfileName &&
      header &&
      this.data?.profile?.name
    ) {
      // Set the profile name
      mobileProfileName.textContent = this.data.profile.name;

      // Calculate header height to determine when to switch icons
      const getHeaderHeight = () => header.offsetHeight;

      let isProfileNameShown = false;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const headerHeight = getHeaderHeight();

        // Switch to profile name when scrolled past header
        if (currentScrollY > headerHeight * 0.5 && !isProfileNameShown) {
          // Show profile name when scrolled down
          mobileHomeIcon.classList.add("hidden");
          mobileProfileName.classList.remove("hidden");
          isProfileNameShown = true;
        } else if (currentScrollY <= headerHeight * 0.5 && isProfileNameShown) {
          // Show home icon when at the top
          mobileHomeIcon.classList.remove("hidden");
          mobileProfileName.classList.add("hidden");
          isProfileNameShown = false;
        }
      };

      // Add scroll listener with throttling for performance
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      });

      // Also handle window resize in case header height changes
      window.addEventListener("resize", () => {
        // Recalculate on resize with debouncing
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }

  /**
   * Helper: Set text content of an element - optimized
   * @param {string} id - Element ID
   * @param {string} text - Text content to set
   * @returns {void}
   */
  setElementText(id, text) {
    const element = document.getElementById(id);

    if (element && element.textContent !== text) {
      element.textContent = text;
    }
  }

  /**
   * Helper: Set href attribute of an element - optimized
   * @param {string} id - Element ID
   * @param {string} url - URL to set as href
   * @returns {void}
   */
  setElementHref(id, url) {
    const element = document.getElementById(id);

    if (element && element.href !== url) {
      element.href = url;
    }
  }

  /**
   * Helper: Create a styled list
   * @returns {HTMLUListElement} Created list element
   */
  createList() {
    const list = document.createElement("ul");
    list.className =
      "list-minimal space-y-3 text-gray-700 leading-relaxed break-words overflow-hidden";
    return list;
  }

  /**
   * Helper: Create a list item with bullet point - optimized
   * @param {string} content - HTML content for the list item
   * @returns {HTMLLIElement} Created list item element
   */
  createListItem(content) {
    const li = document.createElement("li");
    li.className = "flex items-start";

    // Use template for better performance
    const template = document.createElement("template");
    template.innerHTML = `
      <span class="mr-3 text-academic-blue flex-shrink-0 font-bold">•</span>
      <span class="break-words overflow-hidden min-w-0 flex-1">${content}</span>
    `;

    li.appendChild(template.content.cloneNode(true));
    return li;
  }

  /**
   * Helper: Create optimized minimal container
   * @param {string} content - HTML content for the container
   * @returns {HTMLDivElement} Created container element
   */
  createMinimalContainer(content) {
    const container = document.createElement("div");
    container.className = "section-minimal";
    container.innerHTML = content;
    return container;
  }

  /**
   * Load section content (for lazy loading)
   * @param {HTMLElement} section - Section element to load
   */
  loadSection(section) {
    const sectionId = section.id;

    switch (sectionId) {
      case "publications":
        if (!section.hasChildNodes()) this.populatePublications();
        break;
      case "awards":
        if (!section.hasChildNodes()) this.populateAwards();
        break;
      case "community":
        if (!section.hasChildNodes()) this.populateCommunity();
        break;
    }
  }

  /**
   * Helper: Populate a list with simple text items
   * @param {string} listId - ID of the list element
   * @param {string[]} items - Array of text items to add
   * @returns {void}
   */
  populateList(listId, items) {
    const list = document.getElementById(listId);

    items.forEach((item) => {
      list.appendChild(this.createListItem(item));
    });
  }

  /**
   * Handle errors and show fallback content
   * @param {Error} error - Error object
   * @returns {void}
   */
  handleError(error) {
    console.error("Error loading data.json:", error);

    // Show error message to user
    this.setElementText("header-name", "Professor Portfolio");
    this.setElementText("header-title", "Loading...");
    this.setElementText("profile-name", "Loading content...");
    this.setElementText("profile-title", "Please check console for errors");
  }
}

/**
 * Initialize portfolio when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  const portfolio = new PortfolioManager();
  portfolio.init();
});
