/**
 * PatientSearch - A lightweight patient search library
 * Can be embedded in a page (modal) or used in an iframe
 * Zero dependencies - Pure vanilla JavaScript with FHIR support
 */

import './styles.css';
import { MOCK_PATIENTS_BUNDLE } from './mock-data.js';

/**
 * PatientSearch Class
 */
class PatientSearch {
  constructor(options = {}) {
    this.options = {
      apiUrl: options.apiUrl || null,
      searchFields: options.searchFields || ['name', 'identifier', 'phone', 'email'],
      onSelect: options.onSelect || null,
      iframeMode: options.iframeMode || this.isInIframe(),
      containerId: options.containerId || null
    };

    this.overlay = null;
    this.currentResults = [];
    this.init();
  }

  isInIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  init() {
    // Create modal structure
    this.createModal();
    
    // Bind events
    this.bindEvents();
  }

  createModal() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'patient-search-overlay';
    this.overlay.style.display = 'none'; // Initially hidden
    this.overlay.innerHTML = `
      <div class="patient-search-modal">
        <div class="patient-search-header">
          <h2>Search Patient</h2>
          <button class="patient-search-close" aria-label="Close">&times;</button>
        </div>
        <div class="patient-search-body">
          <div class="patient-search-controls">
            <select class="patient-search-select" id="searchField">
              <option value="name">Name</option>
              <option value="identifier">Patient ID</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </select>
            <input 
              type="text" 
              class="patient-search-input" 
              id="searchInput" 
              placeholder="Enter search term..."
            />
            <button class="patient-search-button" id="searchButton">Search</button>
          </div>
          <div class="patient-search-table-container">
            <div class="patient-search-no-results">
              Enter a search term and click Search to find patients
            </div>
          </div>
        </div>
      </div>
    `;

    // Append to body or container
    if (this.options.containerId) {
      const container = document.getElementById(this.options.containerId);
      if (container) {
        container.appendChild(this.overlay);
      } else {
        document.body.appendChild(this.overlay);
      }
    } else {
      document.body.appendChild(this.overlay);
    }
  }

  bindEvents() {
    const modal = this.overlay.querySelector('.patient-search-modal');
    const closeBtn = this.overlay.querySelector('.patient-search-close');
    const searchBtn = this.overlay.querySelector('#searchButton');
    const searchInput = this.overlay.querySelector('#searchInput');

    // Close button
    closeBtn.addEventListener('click', () => this.hide());

    // Click outside to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });

    // Prevent modal clicks from closing
    modal.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('show')) {
        this.hide();
      }
    });

    // Search button
    searchBtn.addEventListener('click', () => this.performSearch());

    // Enter key in search input
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });
  }

  async performSearch() {
    const searchField = this.overlay.querySelector('#searchField').value;
    const searchTerm = this.overlay.querySelector('#searchInput').value.trim();

    if (!searchTerm) {
      this.showMessage('Please enter a search term');
      return;
    }

    this.showLoading();

    try {
      let results;
      
      if (this.options.apiUrl) {
        // Make API call
        results = await this.fetchPatients(searchField, searchTerm);
      } else {
        // Use mock data
        await this.delay(300); // Simulate API delay
        results = this.searchMockData(searchField, searchTerm);
      }

      this.currentResults = results;
      this.displayResults(results);
    } catch (error) {
      console.error('Search error:', error);
      this.showMessage('Error performing search. Please try again.');
    }
  }

    async fetchPatients(searchField, searchTerm) {
        if (!['name', 'identifier'].includes(searchField)) {
            return [];
        }
        const response = await fetch(`${this.options.apiUrl}?${searchField}=${encodeURIComponent(searchTerm)}`);
        const bundle = await response.json();
        if (bundle.entry && Array.isArray(bundle.entry)) {
            return bundle.entry.map(entry => entry.resource);
        }
        return [];
    }

  searchMockData(field, term) {
    const lowerTerm = term.toLowerCase();
    const bundlePatients = MOCK_PATIENTS_BUNDLE.entry.map(entry => entry.resource);
    return bundlePatients.filter(patient => {
      let value = '';
      
      switch(field) {
        case 'name':
          value = this.getFHIRName(patient);
          break;
        case 'id':
          value = this.getFHIRIdentifier(patient);
          break;
        case 'phone':
          value = this.getFHIRTelecom(patient, 'phone');
          break;
        case 'email':
          value = this.getFHIRTelecom(patient, 'email');
          break;
        default:
          value = '';
      }
      
      return value && value.toString().toLowerCase().includes(lowerTerm);
    });
  }

  displayResults(results) {
    const container = this.overlay.querySelector('.patient-search-table-container');

    if (results.length === 0) {
      container.innerHTML = '<div class="patient-search-no-results">No patients found</div>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'patient-search-table';
    
    table.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          <th>Patient ID</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Date of Birth</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(patient => `
          <tr data-patient-id="${patient.id}">
            <td>${this.escapeHtml(this.getFHIRName(patient))}</td>
            <td>${this.escapeHtml(this.getFHIRIdentifier(patient))}</td>
            <td>${this.escapeHtml(this.getFHIRTelecom(patient, 'phone'))}</td>
            <td>${this.escapeHtml(this.getFHIRTelecom(patient, 'email'))}</td>
            <td>${this.formatDate(patient.birthDate)}</td>
          </tr>
        `).join('')}
      </tbody>
    `;

    container.innerHTML = '';
    container.appendChild(table);

    // Bind row click events
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        const patientId = row.getAttribute('data-patient-id');
        const patient = results.find(p => p.id === patientId);
        this.selectPatient(patient);
      });
    });
  }

  selectPatient(patient) {
    // Call callback if provided
    if (this.options.onSelect && typeof this.options.onSelect === 'function') {
      this.options.onSelect(patient);
    }

    // Send message if in iframe mode
    if (this.options.iframeMode && window.parent !== window) {
      window.parent.postMessage({
        type: 'patientSelected',
        patient: patient
      }, '*');
    }

    // Hide modal
    this.hide();
  }

  showLoading() {
    const container = this.overlay.querySelector('.patient-search-table-container');
    container.innerHTML = '<div class="patient-search-loading">Searching...</div>';
  }

  showMessage(message) {
    const container = this.overlay.querySelector('.patient-search-table-container');
    container.innerHTML = `<div class="patient-search-no-results">${this.escapeHtml(message)}</div>`;
  }

  show() {
    this.overlay.style.display = 'flex';
    // Trigger reflow
    this.overlay.offsetHeight;
    this.overlay.classList.add('show');
    
    // Focus search input
    setTimeout(() => {
      const input = this.overlay.querySelector('#searchInput');
      if (input) {input.focus();}
    }, 300);
  }

  hide() {
    this.overlay.classList.remove('show');
    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 300);
    
    // Send message if in iframe mode and modal was closed without selection
    if (this.options.iframeMode && window.parent !== window) {
      window.parent.postMessage({
        type: 'modalClosed'
      }, '*');
    }
  }

  destroy() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }

  // Helper methods
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatDate(dateStr) {
    if (!dateStr) {return '';}
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // FHIR helper methods
  getFHIRName(patient) {
    if (!patient || !patient.name || !patient.name.length) {return '';}
    const name = patient.name[0];
    const given = name.given ? name.given.join(' ') : '';
    const family = name.family || '';
    return `${given} ${family}`.trim();
  }

  getFHIRIdentifier(patient) {
    if (!patient || !patient.identifier || !patient.identifier.length) {return '';}
    return patient.identifier[0].value || '';
  }

  getFHIRTelecom(patient, system) {
    if (!patient || !patient.telecom || !patient.telecom.length) {return '';}
    const telecom = patient.telecom.find(t => t.system === system);
    return telecom ? telecom.value : '';
  }
}

export default PatientSearch;
