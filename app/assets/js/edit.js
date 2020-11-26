const {remote} = require('electron');

const dropdowns = document.getElementsByClassName("subject");
const subjects = remote.getGlobal('subjects');

console.log(subjects);
console.log(dropdowns);

for (i = 0; i < subjects.length; i++) {
    Array.from(dropdowns).forEach((dropdown) => {
        var option = document.createElement("option");
        option.innerHTML = subjects[i].name;
        dropdown.appendChild(option);
    });
}