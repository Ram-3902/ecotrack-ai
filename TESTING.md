# Testing Guide — EcoTrack AI

This document provides a guide to the testing setup, structure, and best practices for the EcoTrack AI application.

---

## 🛠️ Testing Stack & Configuration

The application uses **Vitest** (a modern, Vite-native testing framework) and **React Testing Library** (RTL) for testing React logic and components.

### Configuration Files

- **[vitest.config.js](file:///r:/grao3/ecotrack/vitest.config.js)**: Configures the test runner to use `jsdom` as the DOM environment, sets up global imports, defines coverage provider/exclusion rules, and points to the setup file.
- **[tests/setup.js](file:///r:/grao3/ecotrack/tests/setup.js)**: Configures global test setups, including extending DOM assertion matchers (`@testing-library/jest-dom`), and mocks external APIs and libraries (e.g., `ResizeObserver`, `recharts`, `jspdf`).

---

## 🚀 How to Run Tests

The following npm scripts are configured in `package.json`:

| Command | Action |
|---|---|
| `npm run test` | Starts Vitest in watch mode (reruns on changes). |
| `npm run test:run` | Runs all tests once and exits (useful for CI/CD). |
| `npm run test:coverage` | Runs all tests and generates a detailed coverage report in terminal and `/coverage` directory. |

---

## 📁 Directory Structure

All test files are organized in the root `tests/` directory:

```text
tests/
├── components/          # Component/Render tests (Navbar, ScoreGauge, etc.)
├── integration/         # Multi-component flows and page routing tests
├── unit/                # Utility calculation and core engines (carbonEngine, insightsEngine)
└── setup.js             # Global mock configuration & RTL environment setup
```

---

## 🏗️ Mocking Patterns & Guidelines

To isolate testing target components and avoid importing heavy or layout-sensitive libraries:

1. **Recharts Charts Mocking**:
   Recharts components are mocked as semantic SVG elements using `React.createElement` inside standard `.js` files to bypass React JSX compiler requirements on plain files.
2. **jsPDF Constructor Mocking**:
   The PDF generator relies on `new jsPDF()`. The constructor must be mocked using a standard `function()` prototype instead of arrow functions, ensuring `new` invocation does not throw syntax or prototype errors:
   ```javascript
   vi.mock('jspdf', () => ({
     jsPDF: vi.fn().mockImplementation(function () {
       return {
         text: vi.fn(),
         save: vi.fn(),
         // other methods...
       };
     })
   }));
   ```
3. **Timer Mocking for AI Processing**:
   Components that run intervals/timeouts (like `App.test.jsx` wizard or loading screens) should use fake timers. Use `vi.useFakeTimers()` to advance time, but make sure to call `vi.useRealTimers()` in the teardown phase.

---

## 📊 Coverage Requirement

The test suite must maintain at least **80% statement and line coverage**. 
Coverage is automatically excluded from utility bundles (e.g. `main.jsx`) and config environments.
To check coverage, run:
```bash
npm run test:coverage
```
