# 🏥 Patient Search Library

A super lightweight JavaScript library for searching and selecting patients with FHIR support. The library can be embedded directly in a page as a modal overlay or launched in an iframe. Zero dependencies, pure vanilla JavaScript with inline CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Lightweight** - No external dependencies, pure vanilla JavaScript
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 🔍 **Flexible Search** - Search by Name, Patient ID, Phone, or Email
- 🏥 **FHIR Compliant** - Full support for FHIR Patient resources
- 📱 **Responsive** - Works on desktop and mobile devices
- 🔒 **Isolated** - Self-contained with no global pollution
- 🚀 **Easy Integration** - Just include the script and initialize
- 💬 **Two Integration Modes** - Embedded modal or iframe with postMessage
- ⌨️ **Keyboard Support** - ESC to close, Enter to search
- 🎭 **Mock Data Included** - Ready to test without backend
- 🧪 **Fully Tested** - Comprehensive unit test coverage
- 📦 **Multiple Formats** - UMD, ES Module, and CommonJS builds

## 📦 Installation

### Via npm

```bash
npm install @angshus/patient-search
```

### Via CDN (unpkg)

**Option 1: Separate CSS file (recommended)**
```html
<link rel="stylesheet" href="https://unpkg.com/@angshus/patient-search/dist/patient-search.css">
<script src="https://unpkg.com/@angshus/patient-search/dist/patient-search.min.js"></script>
```

**Option 2: Bundled (CSS included in JS)**
```html
<!-- No CSS file needed! Styles are injected automatically -->
<script src="https://unpkg.com/@angshus/patient-search/dist/patient-search.bundle.min.js"></script>
```

### Download

Download the latest release from the [releases page](https://github.com/angshus/js-search-patient/releases) and include the files in your project:

**Option 1: Separate CSS file (recommended)**
```html
<link rel="stylesheet" href="path/to/patient-search.css">
<script src="path/to/patient-search.js"></script>
```

**Option 2: Bundled (CSS included in JS)**
```html
<!-- No CSS file needed! -->
<script src="path/to/patient-search.bundle.js"></script>
```

## 🚀 Quick Start

### Option 1: Embedded Modal (Recommended)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
  <link rel="stylesheet" href="node_modules/@angshus/patient-search/dist/patient-search.css">
</head>
<body>
  <button id="searchBtn">Search Patient</button>

  <script src="node_modules/@angshus/patient-search/dist/patient-search.js"></script>
  <script>
    // Initialize
    const patientSearch = new PatientSearch({
      onSelect: (patient) => {
        console.log('Selected patient:', patient);
        alert(`Selected: ${patient.name[0].given[0]} ${patient.name[0].family}`);
      }
    });

    // Show modal on button click
    document.getElementById('searchBtn').addEventListener('click', () => {
      patientSearch.show();
    });
  </script>
</body>
</html>
```

### Option 2: ES Module Import

```javascript
import PatientSearch from '@angshus/patient-search';
import '@angshus/patient-search/dist/patient-search.css';

const patientSearch = new PatientSearch({
  onSelect: (patient) => {
    console.log('Selected patient:', patient);
  }
});

// Show the modal
patientSearch.show();
```

### Option 3: Iframe Integration

**Parent page:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <button id="searchBtn">Search Patient</button>
  
  <!-- Hidden iframe -->
  <iframe id="searchFrame" src="iframe-content.html" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; border:none; z-index:9999;"></iframe>

  <script>
    const iframe = document.getElementById('searchFrame');
    const btn = document.getElementById('searchBtn');

    // Show iframe on button click
    btn.addEventListener('click', () => {
      iframe.style.display = 'block';
    });

    // Listen for patient selection from iframe
    window.addEventListener('message', (event) => {
      if (event.data.type === 'patientSelected') {
        const patient = event.data.patient;
        console.log('Selected patient:', patient);
        
        // Hide iframe
        iframe.style.display = 'none';
      }
    });
  </script>
</body>
</html>
```

**iframe-content.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Patient Search</title>
  <link rel="stylesheet" href="node_modules/@angshus/patient-search/dist/patient-search.css">
</head>
<body>
  <script src="node_modules/@angshus/patient-search/dist/patient-search.js"></script>
  <script>
    const patientSearch = new PatientSearch({
      iframeMode: true
    });
    patientSearch.show();
  </script>
</body>
</html>
```

## 📖 API Reference

### Constructor Options

```javascript
new PatientSearch({
  apiUrl: string,           // Optional: API endpoint for patient search
  searchFields: array,      // Optional: Fields to search ['name', 'id', 'phone', 'email']
  onSelect: function,       // Optional: Callback when patient is selected
  iframeMode: boolean,      // Optional: Enable iframe mode (auto-detected)
  containerId: string       // Optional: ID of container element
})
```

### Methods

#### `show()`
Shows the search modal.

```javascript
patientSearch.show();
```

#### `hide()`
Hides the search modal.

```javascript
patientSearch.hide();
```

#### `destroy()`
Removes the search modal from DOM and cleans up.

```javascript
patientSearch.destroy();
```

## 🏥 FHIR Patient Data Structure

The library expects and returns FHIR-compliant Patient resources:

```javascript
{
  resourceType: "Patient",
  id: "550e8400-e29b-41d4-a716-446655440000",
  identifier: [
    {
      system: "http://hospital.example.org/patients",
      value: "PAT001"
    }
  ],
  name: [
    {
      use: "official",
      family: "Doe",
      given: ["John"]
    }
  ],
  telecom: [
    {
      system: "phone",
      value: "555-0123",
      use: "home"
    },
    {
      system: "email",
      value: "john.doe@example.com"
    }
  ],
  gender: "male",
  birthDate: "1980-05-15"
}
```

## 🔌 API Integration

### Expected API Response

If you provide an `apiUrl`, the library will make a GET request with these parameters:
- `field`: The selected search field (name, id, phone, email)
- `term`: The search term entered by user

```
GET /api/patients/search?field=name&term=John
```

The API should return an array of FHIR Patient resources.

If no `apiUrl` is provided, the library uses built-in mock data for testing.

## 🛠️ Development

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/angshus/js-search-patient.git
cd js-search-patient

# Install dependencies
npm install
```

### Build Commands

```bash
# Build for production (minified)
npm run build

# Build for development (with source maps)
npm run build:dev

# Watch mode (rebuild on changes)
npm run dev

# Clean dist folder
npm run clean
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint JavaScript files
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Local Development Server

```bash
# Start a local server
npm run serve

# Then open http://localhost:8080/examples/demo.html
```

## 📁 Project Structure

```
js-search-patient/
├── src/                        # Source files
│   ├── patient-search.js       # Main library
│   ├── styles.css              # CSS styles
│   └── mock-data.js            # Mock FHIR data
├── dist/                       # Built files (generated)
│   ├── patient-search.js       # UMD bundle (requires CSS file)
│   ├── patient-search.min.js   # Minified UMD (requires CSS file)
│   ├── patient-search.bundle.js      # UMD bundle (CSS included)
│   ├── patient-search.bundle.min.js  # Minified UMD (CSS included)
│   ├── patient-search.esm.js   # ES Module bundle
│   ├── patient-search.cjs.js   # CommonJS bundle
│   └── patient-search.css      # Extracted styles
├── test/                       # Test files
│   ├── patient-search.test.js  # Unit tests
│   ├── setup.js                # Test setup
│   └── __mocks__/              # Mock modules
├── examples/                   # Demo files
│   ├── demo.html               # Embedded modal demo (separate CSS)
│   ├── demo-bundle.html        # Embedded modal demo (bundled CSS)
│   ├── iframe-demo.html        # Iframe parent demo
│   └── iframe-content.html     # Iframe content
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
├── jest.config.js             # Jest configuration
├── rollup.config.js           # Rollup bundler config
├── package.json               # Package configuration
└── README.md                  # This file
```

## 📦 Build Output Files

After running `npm run build`, the following files are generated in the `dist/` folder:

### With Separate CSS (Recommended)
- `patient-search.js` + `patient-search.css` - UMD bundle with separate CSS
- `patient-search.min.js` + `patient-search.min.css` - Minified UMD with separate CSS
- `patient-search.esm.js` + `patient-search.esm.css` - ES Module with separate CSS
- `patient-search.cjs.js` + `patient-search.cjs.css` - CommonJS with separate CSS

### With Bundled CSS (Single File)
- `patient-search.bundle.js` - UMD bundle with CSS injected inline
- `patient-search.bundle.min.js` - Minified UMD with CSS injected inline

### When to Use Each:

**Use Separate CSS (`patient-search.js` + `patient-search.css`) when:**
- ✅ You want better caching (CSS changes less frequently than JS)
- ✅ You want to customize styles more easily
- ✅ You're using a build tool that processes CSS separately
- ✅ You want optimal performance

**Use Bundled CSS (`patient-search.bundle.js`) when:**
- ✅ You want simplest integration (single file)
- ✅ You're using CDN and want fewer HTTP requests
- ✅ You're embedding in environments with limited control
- ✅ You want zero configuration setup

## 🎨 Customization

The library uses CSS classes prefixed with `.patient-search-` to avoid conflicts. You can override these styles:

```css
/* Override header gradient */
.patient-search-header {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

/* Override button style */
.patient-search-button {
  background: your-custom-gradient;
}
```

## 🧪 Testing Your Integration

### Test with Mock Data
The library includes 10 mock patients for testing. Try searching for:
- Names: "John", "Jane", "Emily"
- IDs: "PAT001", "PAT005"
- Phone: "555-0123"
- Email: "john.doe@example.com"

### Test with API
Configure your API endpoint:

```javascript
const patientSearch = new PatientSearch({
  apiUrl: 'https://your-api.com/patients/search',
  onSelect: (patient) => {
    // Handle selected patient
  }
});
```

## 🔒 Security Considerations

- **XSS Prevention**: All user inputs are escaped using `escapeHtml()` before rendering
- **CORS**: If using custom API, ensure your backend allows CORS requests
- **postMessage**: In production, validate the origin of messages in iframe mode
- **Input Validation**: Search terms are trimmed and validated before processing

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

The library uses modern JavaScript (ES6+) but is transpiled for broader compatibility.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For questions or issues, please refer to:
- [GitHub Issues](https://github.com/angshus/js-search-patient/issues)
- [Examples](./examples/)
- [API Documentation](#api-reference)

---

**Made with ❤️ for healthcare applications**
