const electron = require('electron');
const url = require('url');
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow, addWindow;

// Listen for app to be ready
app.on('ready', function () {
   //Create new Window
   mainWindow = new BrowserWindow({
       webPreferences: {
           nodeIntegration: true
       }
   });
   //Load html into window
    mainWindow.loadFile('index.html');
    //quit app when closed
    mainWindow.on('closed', function () {
        app.quit();
    });
    //Build Menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});
//Handle create add window
function createAddWindow() {
    //Create new Window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'füge einen neuen Termin ein'
    });
    //Load html into window
    addWindow.loadFile('addWindow.html');
    //Garbage collection handle
    addWindow.on('close', function () {
        addWindow = null;
    });
}

//Catch subject:add
ipcMain.on('item:add', function (e, {name, link}) {
    console.log({name, link});
    mainWindow.webContents.send('subject:add', {name, link});
    addWindow.close();
})

//Create Menu Template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Vorlage importieren'
            },
            {
                label: 'Fach hinzufügen',
                accelerator: process.platform == 'darwin' ? 'Command+A' : 'Ctrl+A',
                click(){
                    createAddWindow();
                }
            }
        ]
    }
]

//If mac, add empty object to menu
if (process.platform == "darwin") {
    mainMenuTemplate.unshift({})
}

//Add dev tools if not in prod
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}