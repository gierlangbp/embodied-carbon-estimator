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


## How to use:

1. Click "+ New Project".
2. Input the "Building ID" (a simple text input to identify the building).
3. Input Latitude and Longitude. You can get these numbers from Google Maps. This is useful for generating a visual overview on your dashboard.
4. Input the Area numerically. Use a dot (.) as the decimal separator.
5. Select "Function" for typology and "Structure" for the structural type. Both of these reflect the RASMI framework.
6. In the columns below, you can select "Material Intensity". By default, the ranges are set to p50.
7. The "Carbon Factor" can be customized according to your region. In this initial version, the number defaults to the baseline embodied carbon factor for Indonesia, derived from various academic papers.
8. Click "Save Project" at the bottom. The project will be added to your list. You can navigate to the "Dashboard" to see the visual map, the number of projects, and the total building area tracked in the app.

Feedback is welcome! As we have decided to make the app open source, feel free to create a new fork or develop it further.
