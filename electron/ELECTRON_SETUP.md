# Electron Setup Documentation

## Configuration Files

### electron/main.cjs
- Main electron process file
- Handles window creation and IPC communication
- Development mode loads from `http://localhost:8080`
- Production mode loads from `dist/index.html`

### electron-builder.json
```json
{
  "appId": "com.focus-motivate-surge",
  "productName": "Focus Motivate Surge",
  "directories": {
    "output": "release"
  },
  "files": [
    "dist/**/*",
    "electron/**/*"
  ],
  "win": {
    "target": "nsis"
  },
  "mac": {
    "target": "dmg"
  },
  "linux": {
    "target": "AppImage"
  }
}
```

## Components

### TitleBar.tsx
- Handles window controls (minimize, maximize, close)
- Uses electron IPC for window management
- Styled with electron.css

### AppLayout.tsx
- Includes TitleBar component
- Properly structured for electron window

## Styles

### styles/electron.css
- Styles for window controls and titlebar
- Imported at the top of index.css
- Includes drag regions and button styling

## Router Configuration
- Using HashRouter instead of BrowserRouter for better electron compatibility
- This ensures proper routing in both development and production builds

## Development Mode
To run in development mode:
```bash
npm run electron:dev
```

## Production Build (Not Yet Tested)
To create a production build:
```bash
npm run electron:build
```

## Type Definitions

### types/electron.d.ts
```typescript
interface Window {
  electron?: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
  };
}
```

## Important Notes
1. The electron app is configured to be frameless with custom window controls
2. Development mode runs on port 8080
3. All electron-specific code is properly isolated in the electron directory
4. IPC communication is handled through the preload script for security
5. The app uses HashRouter for consistent routing behavior in electron
