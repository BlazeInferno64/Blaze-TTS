const { app, BrowserWindow, Notification } = require("electron");
const path = require("path");

if(process.platform === "win32"){
    app.setAppUserModelId(`Blaze TTS`)
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 356,
        height: 567,
        icon: path.join(__dirname , "./public/assets/img/logo.ico"),
        resizable: false
    })

    win.removeMenu();
    win.loadFile("./public/index.html")
}

if(require("electron-squirrel-startup")) app.quit();

app.whenReady().then(() => {
    createWindow();
    app.on("activate",() => {
        if(BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();

})
