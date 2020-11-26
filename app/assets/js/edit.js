const electron = require('electron');
const {ipcRenderer, remote} = electron;

const dropdowns = document.getElementsByClassName("subject");
const subjects = remote.getGlobal('subjects');

for (i = 0; i < subjects.length; i++) {
    Array.from(dropdowns).forEach((dropdown) => {
        var option = document.createElement("option");
        option.innerHTML = subjects[i].name;
        dropdown.appendChild(option);
    });
}

function save() {
    let table = []
        Array.from(dropdowns).forEach((dropdown) => {
            table.push(dropdown.value);
        });
    ipcRenderer.send('table:save', table);
}