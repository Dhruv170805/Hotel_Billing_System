const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ping: (msg) => ipcRenderer.send("ping", msg),
  onPong: (callback) => ipcRenderer.on("pong", (_, data) => callback(data))
});
