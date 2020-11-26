const electron = require('electron');
const {ipcRenderer} = electron;

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const room = document.querySelector('#link').value;
    ipcRenderer.send('subject:add', name, room);
}