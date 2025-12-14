const recordOpenBtn = document.getElementById('record-open-btn');
const overlay = document.querySelector('.overlay');
const form = document.getElementById('study-form');
const recordBtn = document.getElementById('record-btn');
const studyList = document.getElementById('study-list');
const studySortType = document.getElementById('study-table-sort');
let studyLog = [];

window.addEventListener('DOMContentLoaded', init);

function init() {
    loadStorage();
}

recordOpenBtn.addEventListener('click', openModal);
recordBtn.addEventListener('click', formSubmit);
overlay.addEventListener('click', (e)=> {
    if (e.target === overlay) {
        closeModal();
    }
});
studySortType.addEventListener('change', renderList);


function openModal() {
    overlay.classList.remove('hidden');
}

function closeModal() {
    overlay.classList.add('hidden');
}

function formSubmit() {
    const date = document.getElementById('date').value;
    const time = Number(document.getElementById('time').value);
    const contents = document.getElementById('contents').value;
    const category = document.getElementById('category').value;

    if(!date||!time) {
        alert('input Date and Time at least');
        return;
    }

    const id = Date.now();
    studyLog.push({id, date, time, contents, category});
    console.log(studyLog);
    renderList();
    saveStorage();
    form.reset();
    closeModal();
}

function renderList() {
    studyList.innerHTML = "";

    let sortedList = [...studyLog];

    switch(studySortType.value) {
        case "date-asc":
            sortedList.sort((a,b) => new Date(a.date) - new Date(b.date));
            break;
        case "date-des":
            sortedList.sort((a,b) => new Date(b.date) - new Date(a.date));
            break;
        case "time-asc":
            sortedList.sort((a,b) => a.time - b.time);
            break;
        case "time-des":
            sortedList.sort((a,b) => b.time - a.time);
            break;
        case "category":
            sortedList.sort((a,b) => a.category.localeCompare(b.category));
            break;
    }



    sortedList.forEach((e) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td class="list-date">${e.date}</td>
            <td class="list-time">${e.time}min.</td>
            <td class="list-contents">${e.contents}</td>
            <td class="list-category">${e.category}</td>
            <td class="trash"><i class="fa-solid fa-trash"></i></td>
            <td class="edit"><i class="fa-solid fa-pen-to-square"></i></td>
        `;

        studyList.appendChild(tr);
    })

    const sumValue = studyLog.reduce((total, e) => {
        return total + e.time;
    }, 0);
    sum.innerText = sumValue + "min.";
}

function saveStorage() {
    localStorage.setItem('studyLog', JSON.stringify(studyLog));
    console.log('save local storage');
}

function loadStorage() {
    const saved = localStorage.getItem('studyLog');

    if(saved) {
        studyLog = JSON.parse(saved);
    } else {
        studyLog = [];
    }
    console.log('load local storage');
    renderList();
}