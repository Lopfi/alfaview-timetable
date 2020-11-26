const electron = require('electron');
const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = 'development' //production

const {app, BrowserWindow, Menu, ipcMain} = electron;

var mainWindow, addWindow, editWindow;

let rawdata = fs.readFileSync('subjects.json');
json = JSON.parse(rawdata);
global.subjects = [];
for(var i in json) subjects.push(json[i]);

// Listen for app to be ready
app.on('ready', function () {
   //Create new Window
   mainWindow = new BrowserWindow({
       webPreferences: {
           nodeIntegration: true
       }
   });
   //Load html into window
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
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
        title: "füge einen neuen Termin ein",
        webPreferences: {
            nodeIntegration: true
        }
    });
    //Load html into window
    addWindow.loadFile('./assets/html/addWindow.html');
    //Garbage collection handle
    addWindow.on('close', function () {
        addWindow = null;
    });
}

//Handle create edit window
function createEditWindow() {
    //Create new Window
    editWindow = new BrowserWindow({
        title: "Plan bearbeiten",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    //Load html into window
    editWindow.loadFile('./assets/html/editWindow.html');

    //Garbage collection handle
    editWindow.on('close', function () {
        editWindow = null;
    });
}

//Catch subject:add
ipcMain.on('subject:add', function (e, name, link) {
    console.log(name, link);
    var subject = {name: name, link: link};
    subjects.push(subject);
    fs.writeFile(
        './subjects.json',
        JSON.stringify(subjects),
        function (err) {
            if (err) console.error('error saving subjects');
        }
    );
    console.log(subjects);
    addWindow.close();
});

//Create Menu Template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Plan bearbeiten',
                click(){createEditWindow();}
            },
            {
                label: 'Fach hinzufügen',
                accelerator: process.platform == 'darwin' ? 'Command+K' : 'Ctrl+K',
                click(){createAddWindow();}
            }
        ]
    }
];

//If mac, add empty object to menu
if (process.platform == "darwin") mainMenuTemplate.unshift({});

//Add dev tools if not in prod
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {focusedWindow.toggleDevTools();}
            },
            {
                role: 'reload'
            }
        ]
    });
}