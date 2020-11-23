const electron = require('electron');
const url = require('url');
const path = require('path')

const {app, BrowserWindow, Menu} = electron;

let mainWindow, addWindow;

// Listen for app to be ready
app.on('ready', function () {
   //Create new Window
   mainWindow = new BrowserWindow({});
   //Load html into window
    mainWindow.loadFile('index.html')

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
    addWindow.loadFile('add.html')
}

//Create Menu Template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Load table'
            },
            {
                label: 'add something',
                accelerator: process.platform == 'darwin' ? 'Command+A' : 'Ctrl+A',
                click(){
                    createAddWindow();
                }
            }
        ]
    }
]