/**
 * Academic Portfolio Website JavaScript
 * Handles data loading and DOM manipulation for professor profile website
 */

"use strict";

/**
 * Main Portfolio Manager Class
 * Handles all data loading and content population
 */
class PortfolioManager {
  /**
   * Initialize Portfolio Manager
   */
  constructor() {
    this.data = null;
  }

  /**
   * Initialize the portfolio by loading data and populating content
   * @returns {Promise<void>}
   */
  async init() {
    try {
      await this.loadData();
      this.populateAllSections();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Load data from JSON file
   * @returns {Promise<void>}
   * @throws {Error} When fetch fails or response is not ok
   */
  async loadData() {
    const response = await fetch("data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    this.data = await response.json();
  }

  /**
   * Populate all sections with data
   * @returns {void}
   */
  populateAllSections() {
    this.populateHeader();
    this.populateProfile();
    this.populateProjects();
    this.populateCourses();
    this.populatePublications();
    this.populateAwards();
    this.populateCommunity();
    this.populateContact();
  }

  /**
   * Populate header section
   * @returns {void}
   */
  populateHeader() {
    this.setElementText("header-name", this.data.profile.name);
    this.setElementText("header-title", this.data.profile.title);
  }

  /**
   * Populate profile section
   * @returns {void}
   */
  populateProfile() {
    const { profile } = this.data;

    // Basic info
    this.setElementText("profile-name", profile.name);
    this.setElementText("profile-title", profile.title);
    this.setElementText("profile-bio", profile.bio);
    this.setElementText("interests", profile.interests);

    // Office info
    const officeText = `${profile.office.department}, ${profile.office.faculty}, ${profile.office.university}, ${profile.office.address}`;
    this.setElementText("office-info", officeText);

    // Academic background
    this.populateList("academic-background", profile.academicBackground);

    // Research profile links
    this.setElementHref("scopus-link", profile.scopus);
    this.setElementHref("google-scholar-link", profile.googleScholar);
    this.setElementHref("sinta-link", profile.sinta);
    this.setElementHref("orcid-link", profile.orcid);
    this.setElementHref("linkedin-link", profile.linkedin);
  }

  /**
   * Populate projects section
   * @returns {void}
   */
  populateProjects() {
    const container = document.getElementById("projects-container");
    const list = this.createList();

    this.data.projects.forEach((project) => {
      const content = `<strong class="text-academic-blue">${project.title}</strong> (${project.year}) - ${project.description}`;
      list.appendChild(this.createListItem(content));
    });

    container.appendChild(list);
  }

  /**
   * Populate courses section
   * @returns {void}
   */
  populateCourses() {
    const tbody = document.querySelector("#courses-table tbody");

    this.data.courses.forEach((course) => {
      const row = document.createElement("tr");
      row.className =
        "hover:bg-blue-50 transition-colors duration-200 even:bg-gray-50";
      row.innerHTML = `
        <td class="px-6 py-4 text-gray-800 font-medium">${course.name}</td>
        <td class="px-6 py-4 text-gray-600">${course.semester}</td>
        <td class="px-6 py-4 text-gray-600">${course.description}</td>
      `;
      tbody.appendChild(row);
    });
  }

  /**
   * Populate publications section
   * @returns {void}
   */
  populatePublications() {
    const list = document.getElementById("publications-list");
    list.className = "space-y-2 text-gray-700 leading-relaxed";

    this.data.publications.forEach((pub) => {
      list.appendChild(this.createListItem(pub));
    });
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
      list.appendChild(this.createListItem(activity));
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
   * Helper: Set text content of an element
   * @param {string} id - Element ID
   * @param {string} text - Text content to set
   * @returns {void}
   */
  setElementText(id, text) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = text;
    }
  }

  /**
   * Helper: Set href attribute of an element
   * @param {string} id - Element ID
   * @param {string} url - URL to set as href
   * @returns {void}
   */
  setElementHref(id, url) {
    const element = document.getElementById(id);

    if (element) {
      element.href = url;
    }
  }

  /**
   * Helper: Create a styled list
   * @returns {HTMLUListElement} Created list element
   */
  createList() {
    const list = document.createElement("ul");
    list.className = "space-y-2 text-gray-700 leading-relaxed";
    return list;
  }

  /**
   * Helper: Create a list item with bullet point
   * @param {string} content - HTML content for the list item
   * @returns {HTMLLIElement} Created list item element
   */
  createListItem(content) {
    const li = document.createElement("li");
    li.className = "flex";
    li.innerHTML = `
      <span class="mr-2 text-gray-500">•</span>
      <span>${content}</span>
    `;
    return li;
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
