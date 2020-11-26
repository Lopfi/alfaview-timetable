const {remote} = require('electron');

const subjects = Array.from(document.getElementsByClassName("subject"));
const table = remote.getGlobal('table');

for (i = 0; i < table.length; i++) {
    var data = document.createElement("a");
    data.setAttribute('href', table[i].room);
    data.innerHTML = table[i].name;
    subjects[i].appendChild(data);
}