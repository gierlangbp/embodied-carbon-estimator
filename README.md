# Material Intensity & Carbon Estimator - Source Code

This is the source code for the **Material Intensity Carbon** Electron application.

## Prerequisites
- **Node.js**: Install from [nodejs.org](https://nodejs.org/) (LTS version recommended).
- **Git**: (Optional) if you want to use version control.

## Installation

1. Open this folder in your terminal.
2. Install dependencies:
   ```bash
   npm install
   ```

## Development
To run the app in development mode:
```bash
npm run electron:dev
```

## Build
To build the standalone application for Windows:
```bash
npm run electron:builder
```

## Project Structure
- `src/`: React frontend code.
- `electron/`: Main Electron process code (`main.cjs`, `preload.cjs`).
- `public/`: Static assets (CSV data, icons).
