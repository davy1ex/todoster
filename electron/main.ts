import { app, BrowserWindow, session } from "electron";
import * as path from "path";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Set security headers to allow API requests
  session.defaultSession.webRequest.onHeadersReceived(
    (details: any, callback: (response: any) => void) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http://localhost:* ws://localhost:*; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
          ],
        },
      });
    }
  );

  // In development, load from the dev server
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    // In production, load the built files
    const appPath = app.getAppPath();
    const indexPath = path.join(appPath, "dist", "index.html");
    console.log("App path:", appPath);
    console.log("Loading from:", indexPath);
    win.loadFile(indexPath).catch((err) => {
      console.error("Failed to load index.html:", err);
      console.log("Current directory:", __dirname);
    });
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
