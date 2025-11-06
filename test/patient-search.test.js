/**
 * Patient Search Library Tests
 */

import PatientSearch from '../src/patient-search.js';
import { MOCK_PATIENTS } from '../src/mock-data.js';

describe('PatientSearch', () => {
  let patientSearch;
  
  beforeEach(() => {
    // Clear the document body before each test
    document.body.innerHTML = '';
  });
  
  afterEach(() => {
    // Clean up after each test
    if (patientSearch) {
      patientSearch.destroy();
    }
  });

  describe('Initialization', () => {
    test('should create instance with default options', () => {
      patientSearch = new PatientSearch();
      
      expect(patientSearch).toBeInstanceOf(PatientSearch);
      expect(patientSearch.options.searchFields).toEqual(['name', 'id', 'phone', 'email']);
      expect(patientSearch.options.apiUrl).toBeNull();
      expect(patientSearch.overlay).not.toBeNull();
    });

    test('should create instance with custom options', () => {
      const onSelect = jest.fn();
      const apiUrl = 'https://api.example.com/patients';
      
      patientSearch = new PatientSearch({
        apiUrl,
        searchFields: ['name', 'id'],
        onSelect
      });
      
      expect(patientSearch.options.apiUrl).toBe(apiUrl);
      expect(patientSearch.options.searchFields).toEqual(['name', 'id']);
      expect(patientSearch.options.onSelect).toBe(onSelect);
    });

    test('should append modal to document body', () => {
      patientSearch = new PatientSearch();
      
      const overlay = document.querySelector('.patient-search-overlay');
      expect(overlay).not.toBeNull();
      expect(overlay.style.display).toBe('none');
    });

    test('should append modal to custom container if specified', () => {
      const container = document.createElement('div');
      container.id = 'custom-container';
      document.body.appendChild(container);
      
      patientSearch = new PatientSearch({ containerId: 'custom-container' });
      
      const overlay = container.querySelector('.patient-search-overlay');
      expect(overlay).not.toBeNull();
    });
  });

  describe('FHIR Helper Methods', () => {
    beforeEach(() => {
      patientSearch = new PatientSearch();
    });

    test('should extract FHIR patient name correctly', () => {
      const patient = MOCK_PATIENTS[0];
      const name = patientSearch.getFHIRName(patient);
      
      expect(name).toBe('John Doe');
    });

    test('should extract FHIR identifier correctly', () => {
      const patient = MOCK_PATIENTS[0];
      const id = patientSearch.getFHIRIdentifier(patient);
      
      expect(id).toBe('PAT001');
    });

    test('should extract FHIR phone telecom correctly', () => {
      const patient = MOCK_PATIENTS[0];
      const phone = patientSearch.getFHIRTelecom(patient, 'phone');
      
      expect(phone).toBe('555-0123');
    });

    test('should extract FHIR email telecom correctly', () => {
      const patient = MOCK_PATIENTS[0];
      const email = patientSearch.getFHIRTelecom(patient, 'email');
      
      expect(email).toBe('john.doe@example.com');
    });

    test('should return empty string for invalid FHIR name', () => {
      const name = patientSearch.getFHIRName(null);
      expect(name).toBe('');
    });

    test('should return empty string for invalid FHIR identifier', () => {
      const id = patientSearch.getFHIRIdentifier({});
      expect(id).toBe('');
    });

    test('should return empty string for invalid FHIR telecom', () => {
      const phone = patientSearch.getFHIRTelecom(null, 'phone');
      expect(phone).toBe('');
    });
  });

  describe('Modal Visibility', () => {
    beforeEach(() => {
      patientSearch = new PatientSearch();
    });

    test('should show modal when show() is called', () => {
      patientSearch.show();
      
      const overlay = document.querySelector('.patient-search-overlay');
      expect(overlay.style.display).toBe('flex');
      
      // Wait for animation
      setTimeout(() => {
        expect(overlay.classList.contains('show')).toBe(true);
      }, 10);
    });

    test('should hide modal when hide() is called', (done) => {
      patientSearch.show();
      patientSearch.hide();
      
      const overlay = document.querySelector('.patient-search-overlay');
      expect(overlay.classList.contains('show')).toBe(false);
      
      // Wait for animation to complete
      setTimeout(() => {
        expect(overlay.style.display).toBe('none');
        done();
      }, 350);
    });

    test('should focus search input when shown', (done) => {
      patientSearch.show();
      
      setTimeout(() => {
        const input = document.querySelector('#searchInput');
        expect(document.activeElement).toBe(input);
        done();
      }, 350);
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      patientSearch = new PatientSearch();
    });

    test('should search by name', () => {
      const results = patientSearch.searchMockData('name', 'John');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name[0].given[0]).toBe('John');
    });

    test('should search by patient ID', () => {
      const results = patientSearch.searchMockData('id', 'PAT001');
      
      expect(results.length).toBe(1);
      expect(results[0].identifier[0].value).toBe('PAT001');
    });

    test('should search by phone', () => {
      const results = patientSearch.searchMockData('phone', '555-0123');
      
      expect(results.length).toBe(1);
      const phone = results[0].telecom.find(t => t.system === 'phone');
      expect(phone.value).toBe('555-0123');
    });

    test('should search by email', () => {
      const results = patientSearch.searchMockData('email', 'john.doe');
      
      expect(results.length).toBe(1);
      const email = results[0].telecom.find(t => t.system === 'email');
      expect(email.value).toContain('john.doe');
    });

    test('should return empty array for no matches', () => {
      const results = patientSearch.searchMockData('name', 'NonExistentName');
      
      expect(results).toEqual([]);
    });

    test('should perform case-insensitive search', () => {
      const results = patientSearch.searchMockData('name', 'JOHN');
      
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Result Display', () => {
    beforeEach(() => {
      patientSearch = new PatientSearch();
    });

    test('should display search results in table', () => {
      const results = [MOCK_PATIENTS[0]];
      patientSearch.displayResults(results);
      
      const table = document.querySelector('.patient-search-table');
      expect(table).not.toBeNull();
      
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(1);
    });

    test('should display "no results" message for empty results', () => {
      patientSearch.displayResults([]);
      
      const message = document.querySelector('.patient-search-no-results');
      expect(message).not.toBeNull();
      expect(message.textContent).toBe('No patients found');
    });

    test('should display loading message', () => {
      patientSearch.showLoading();
      
      const loading = document.querySelector('.patient-search-loading');
      expect(loading).not.toBeNull();
      expect(loading.textContent).toBe('Searching...');
    });

    test('should display custom message', () => {
      const customMessage = 'Custom test message';
      patientSearch.showMessage(customMessage);
      
      const message = document.querySelector('.patient-search-no-results');
      expect(message).not.toBeNull();
      expect(message.textContent).toBe(customMessage);
    });

    test('should escape HTML in results', () => {
      const maliciousPatient = {
        ...MOCK_PATIENTS[0],
        name: [{ use: 'official', family: '<script>alert("xss")</script>', given: ['John'] }]
      };
      
      patientSearch.displayResults([maliciousPatient]);
      
      const table = document.querySelector('.patient-search-table');
      expect(table.innerHTML).not.toContain('<script>');
      expect(table.innerHTML).toContain('&lt;script&gt;');
    });
  });

  describe('Patient Selection', () => {
    test('should call onSelect callback when patient is selected', () => {
      const onSelect = jest.fn();
      patientSearch = new PatientSearch({ onSelect });
      
      const patient = MOCK_PATIENTS[0];
      patientSearch.selectPatient(patient);
      
      expect(onSelect).toHaveBeenCalledWith(patient);
    });

    test('should hide modal after patient selection', () => {
      patientSearch = new PatientSearch();
      patientSearch.show();
      
      const patient = MOCK_PATIENTS[0];
      patientSearch.selectPatient(patient);
      
      const overlay = document.querySelector('.patient-search-overlay');
      expect(overlay.classList.contains('show')).toBe(false);
    });

    test('should handle row click to select patient', () => {
      const onSelect = jest.fn();
      patientSearch = new PatientSearch({ onSelect });
      
      const results = [MOCK_PATIENTS[0]];
      patientSearch.currentResults = results;
      patientSearch.displayResults(results);
      
      const row = document.querySelector('tbody tr');
      row.click();
      
      expect(onSelect).toHaveBeenCalledWith(MOCK_PATIENTS[0]);
    });
  });

  describe('Event Handlers', () => {
    beforeEach(() => {
      patientSearch = new PatientSearch();
      patientSearch.show();
    });

    test('should close modal on ESC key press', () => {
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escEvent);
      
      const overlay = document.querySelector('.patient-search-overlay');
      expect(overlay.classList.contains('show')).toBe(false);
    });

    test('should close modal when clicking outside', () => {
      const overlay = document.querySelector('.patient-search-overlay');
      overlay.click();
      
      expect(overlay.classList.contains('show')).toBe(false);
    });

    test('should not close modal when clicking inside', () => {
      const modal = document.querySelector('.patient-search-modal');
      modal.click();
      
      const overlay = document.querySelector('.patient-search-overlay');
      expect(overlay.classList.contains('show')).toBe(true);
    });

    test('should close modal when clicking close button', () => {
      const closeBtn = document.querySelector('.patient-search-close');
      closeBtn.click();
      
      const overlay = document.querySelector('.patient-search-overlay');
      expect(overlay.classList.contains('show')).toBe(false);
    });

    test('should perform search on Enter key in input', () => {
      const searchSpy = jest.spyOn(patientSearch, 'performSearch');
      
      const input = document.querySelector('#searchInput');
      input.value = 'John';
      
      const enterEvent = new KeyboardEvent('keypress', { key: 'Enter' });
      input.dispatchEvent(enterEvent);
      
      expect(searchSpy).toHaveBeenCalled();
    });

    test('should perform search on button click', () => {
      const searchSpy = jest.spyOn(patientSearch, 'performSearch');
      
      const input = document.querySelector('#searchInput');
      input.value = 'John';
      
      const searchBtn = document.querySelector('#searchButton');
      searchBtn.click();
      
      expect(searchSpy).toHaveBeenCalled();
    });
  });

  describe('Input Validation', () => {
    beforeEach(() => {
      patientSearch = new PatientSearch();
    });

    test('should show message when search term is empty', async () => {
      const input = document.querySelector('#searchInput');
      input.value = '';
      
      await patientSearch.performSearch();
      
      const message = document.querySelector('.patient-search-no-results');
      expect(message.textContent).toBe('Please enter a search term');
    });

    test('should trim whitespace from search term', async () => {
      const searchSpy = jest.spyOn(patientSearch, 'searchMockData');
      
      const input = document.querySelector('#searchInput');
      input.value = '  John  ';
      
      await patientSearch.performSearch();
      
      expect(searchSpy).toHaveBeenCalledWith('name', 'John');
    });
  });

  describe('Helper Methods', () => {
    beforeEach(() => {
      patientSearch = new PatientSearch();
    });

    test('should escape HTML correctly', () => {
      const escaped = patientSearch.escapeHtml('<script>alert("xss")</script>');
      expect(escaped).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });

    test('should format date correctly', () => {
      const formatted = patientSearch.formatDate('1980-05-15');
      expect(formatted).toMatch(/May 15, 1980/);
    });

    test('should return empty string for invalid date', () => {
      const formatted = patientSearch.formatDate('');
      expect(formatted).toBe('');
    });

    test('should delay for specified milliseconds', async () => {
      const start = Date.now();
      await patientSearch.delay(100);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('Iframe Mode', () => {
    test('should detect iframe mode correctly', () => {
      patientSearch = new PatientSearch();
      
      // In jsdom, window.self === window.top
      expect(patientSearch.isInIframe()).toBe(false);
    });

    test('should use iframe mode when specified', () => {
      patientSearch = new PatientSearch({ iframeMode: true });
      
      expect(patientSearch.options.iframeMode).toBe(true);
    });
  });

  describe('Cleanup', () => {
    test('should remove modal from DOM on destroy', () => {
      patientSearch = new PatientSearch();
      
      const overlay = document.querySelector('.patient-search-overlay');
      expect(overlay).not.toBeNull();
      
      patientSearch.destroy();
      
      const overlayAfter = document.querySelector('.patient-search-overlay');
      expect(overlayAfter).toBeNull();
    });
  });

  describe('API Integration', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      global.fetch.mockRestore();
    });

    test('should call API when apiUrl is provided', async () => {
      const mockResponse = [MOCK_PATIENTS[0]];
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      patientSearch = new PatientSearch({
        apiUrl: 'https://api.example.com/patients'
      });

      const input = document.querySelector('#searchInput');
      input.value = 'John';

      await patientSearch.performSearch();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/patients?field=name&term=John'
      );
    });

    test('should handle API errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API Error'));

      patientSearch = new PatientSearch({
        apiUrl: 'https://api.example.com/patients'
      });

      const input = document.querySelector('#searchInput');
      input.value = 'John';

      await patientSearch.performSearch();

      const message = document.querySelector('.patient-search-no-results');
      expect(message.textContent).toBe('Error performing search. Please try again.');
    });
  });
});
