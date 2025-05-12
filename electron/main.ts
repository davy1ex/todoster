import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // In production, try multiple possible paths
    const possiblePaths = [
      path.join(__dirname, "..", "index.html"),
      path.join(__dirname, "..", "..", "index.html"),
      path.join(process.resourcesPath, "app", "index.html"),
      path.join(app.getAppPath(), "dist", "index.html"),
    ].map(p => path.resolve(p));

    console.log("Searching for index.html in:");
    possiblePaths.forEach(p => console.log("- ", p));
    console.log("Current directory:", __dirname);
    console.log("App path:", app.getAppPath());
    console.log("Resource path:", process.resourcesPath);

    let loaded = false;
    for (const indexPath of possiblePaths) {
      if (fs.existsSync(indexPath)) {
        console.log("Found index.html at:", indexPath);
        try {
          const url = new URL(`file://${indexPath}`);
          console.log("Loading URL:", url.href);
          mainWindow.loadURL(url.href)
            .then(() => {
              loaded = true;
              console.log("Successfully loaded:", indexPath);
              // Open DevTools in production for debugging
              mainWindow.webContents.openDevTools();
            })
            .catch(e => {
              console.error(`Failed to load ${indexPath}:`, e);
            });
          break;
        } catch (e) {
          console.error(`Error creating URL for ${indexPath}:`, e);
        }
      } else {
        console.log("Not found:", indexPath);
      }
    }

    if (!loaded) {
      console.error("Could not find index.html in any of these locations:", possiblePaths);
      // List directory contents for debugging
      possiblePaths.forEach(dir => {
        const parentDir = path.dirname(dir);
        if (fs.existsSync(parentDir)) {
          console.log(`Contents of ${parentDir}:`, fs.readdirSync(parentDir));
        }
      });
    }
  }

  // Handle window state
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window-state-change", "maximized");
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window-state-change", "normal");
  });
}

// Start Vite dev server in development mode
async function startDevServer() {
  if (process.env.NODE_ENV === "development") {
    const { createServer } = await import("vite");
    const server = await createServer({
      configFile: path.join(process.cwd(), "vite.config.ts"),
    });
    await server.listen();
  }
}

app.whenReady().then(async () => {
  if (process.env.NODE_ENV === "development") {
    await startDevServer();
  }
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Example IPC handlers
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-platform", () => {
  return process.platform;
});
