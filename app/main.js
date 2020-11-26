const electron = require('electron');
const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = 'development' //production

const {app, BrowserWindow, Menu, ipcMain} = electron;

var mainWindow, addWindow, editWindow;

let rawsubjects = fs.readFileSync(path.join(__dirname, '/data', 'subjects.json'));
subjects_json = JSON.parse(rawsubjects);
global.subjects = [];
for(var i in subjects_json) subjects.push(subjects_json[i]);

let rawtable = fs.readFileSync(path.join(__dirname, '/data', 'table.json'));
table_json = JSON.parse(rawtable);
global.table = [];
for(var i in table_json) table.push(table_json[i]);

// Listen for app to be ready
app.on('ready', function () {
   //Create new Window
   mainWindow = new BrowserWindow({
       webPreferences: {
           nodeIntegration: true,
           enableRemoteModule: true
       }
   });
   //Load html into window
    mainWindow.loadFile(path.join(__dirname, 'assets/html/', 'index.html'));
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
        title: "Fächer bearbeiten",
        webPreferences: {
            nodeIntegration: true
        }
    });
    //Load html into window
    addWindow.loadFile(path.join(__dirname, 'assets/html/', 'addWindow.html'));
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
    editWindow.loadFile(path.join(__dirname, 'assets/html/', 'editWindow.html'));

    //Garbage collection handle
    editWindow.on('close', function () {
        editWindow = null;
    });
}

//Catch subject:add
ipcMain.on('subject:add', function (e, name, room) {
    var subject = {name: name, room: room};
    subjects.push(subject);
    fs.writeFile(
        path.join(__dirname, '/data', 'subjects.json'),
        JSON.stringify(subjects),
        function (err) {
            if (err) console.error('error saving subjects');
        }
    );
    addWindow.close();
});

//Catch table:save
ipcMain.on('table:save', function (e, table) {
    for (i = 0; i < table.length; i++) {
        for (var x = 0; x < subjects.length; x++) {
            if (subjects[x].name === table[i]) {
                var element = {name: table[i],room: subjects[x].room}
            }
        }
        table[i] = element;
    }
    fs.writeFile(
        path.join(__dirname, '/data', 'table.json'),
        JSON.stringify(table),
        function (err) {
            if (err) console.error('error saving table');
        }
    );
    editWindow.close();
});

//Create Menu Template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Plan bearbeiten',
                accelerator: process.platform == 'darwin' ? 'Command+E' : 'Ctrl+E',
                click(){createEditWindow();}
            },
            {
                label: 'Fächer bearbeiten',
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