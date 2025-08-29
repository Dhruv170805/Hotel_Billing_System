const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // optional
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, "../assets/app-icon.ico")
  });

  if (process.env.ELECTRON_START_URL) {
    // Running in dev mode → load from CRA dev server
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    // Running from build → load React build files
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// When Electron is ready → create window
app.whenReady().then(createWindow);

// Quit when all windows are closed (except Mac)
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

// Example IPC (React ↔ Electron communication)
ipcMain.on("ping", (event, arg) => {
  console.log("📩 Received ping:", arg);
  event.reply("pong", "Hello from Electron main process!");
});
