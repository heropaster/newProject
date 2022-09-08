const balance = document.querySelector('.value');
const increaseTotal = document.querySelector('.increase_total');
const decreaseTotal = document.querySelector('.decrease_total');
const valueCircle = document.querySelector('.circle');

//TOGGLING
const decreaseBtn = document.querySelector('.tab_1');
const increaseBtn = document.querySelector('.tab_2');
const allBtn = document.querySelector('.tab_3');

const increaseEl = document.querySelector('#increase');
const decreaseEl = document.querySelector('#decrease');
const allEl = document.querySelector('#all');

const increaseList = document.querySelector('#increase .list');
const decreaseList = document.querySelector('#decrease .list');
const allList = document.querySelector('#decrease .list');

const addDecrease = document.querySelector('.add_decrease');
const decreaseTitle = document.querySelector('#decrease_title_input');
const decreaseAmount = document.querySelector('#decrease_amount_input');

const addIncrease = document.querySelector('.add_increase');
const increaseTitle = document.querySelector('#increase_title_input');
const increaseAmount = document.querySelector('#increase_amount_input');

//TOGGLING
decreaseBtn.addEventListener('click', function() {
    active(decreaseBtn);
    inactive([increaseBtn, allBtn]);
    show(decreaseEl);
    hide([increaseEl, allEl])
})
increaseBtn.addEventListener('click', function() {
    active(increaseBtn);
    inactive([decreaseBtn, allBtn]);
    show(increaseEl);
    hide([decreaseEl, allEl])
})
allBtn.addEventListener('click', function() {
    active(allBtn);
    inactive([decreaseBtn, increaseBtn]);
    show(allEl);
    hide([increaseEl, decreaseEl])
})

//Activating, unactivating

const active = (elem) => {
    elem.classList.add("active");
}
const inactive  = ([elem1, elem2]) => {
    elem1.classList.remove('active');
    elem2.classList.remove('active');
}

//New tab
const show = (elem) => {
    elem.classList.remove('hide');
}
const hide = ([elem1, elem2]) => {
    elem1.classList.add('hide');
    elem2.classList.add('hide')
}
//add buttonsLogic and clear
let Entry_list = []
addDecrease.addEventListener('click', function(){
    if (!decreaseTitle.value || !decreaseAmount.value) return;

    let decrease = {
        type: 'decrease',
        title: decreaseTitle.value,
        amount: parseFloat(decreaseAmount.value), 
    }
    Entry_list.push(decrease);
    updateUI()
    clearInput([decreaseTitle, decreaseAmount]);
});
addIncrease.addEventListener('click', function(){
    if (!increaseTitle.value || !increaseAmount.value) return;

    let income = {
        type: 'income',
        title: increaseTitle.value,
        amount: parseFloat(increaseAmount.value), 
    }
    Entry_list.push(income);
    updateUI()
    clearInput([increaseTitle, increaseAmount]);

});
//END btnlogic

//input logic
const clearInput = ([title, amount]) => {
    title.value = '';
    amount.value = ''
};
//UI LOGIC
//DELETE ENTRY
function deleteEntry(entry) {
    Entry_list.splice(entry.id, 1);
    updateUI();
}
//EDIT ENTRY
function editEntry(ENTRY) {
    let entry = Entry_list[ENTRY.id];

    if (entry.type === 'income') {
        increaseAmount.value = entry.amount;
        increaseTitle.value = entry.title;
    }else if (entry.type === 'decrease') {
        decreaseAmount.value = entry.amount;
        decreaseTitle.value = entry.title
    }
    deleteEntry(ENTRY)
}
const showEntry = (list, type, title, amount, id) => {
    const entry = `
    <li id="${id}" class="${type}">
        <div class="entry">${title}: ₽${amount} </div>
        <div class="edit"></div>
        <div class="delete"></div>
    </li>`
    
    const position = 'afterbegin';
    list.insertAdjacentHTML(position, entry)
}

const updateUI = () => {
    income = calculateTotal('income', Entry_list);
    expense = calculateTotal('decrease', Entry_list);
    totalBalance = Math.abs(calculateBalance(income, expense));

    let sign = (income >= expense) ? '₽' : '-₽'
    balance.innerHTML = `<small>${sign}</small>${totalBalance}`;
    increaseTotal.innerHTML = `<small>₽</small>${income}`;
    decreaseTotal.innerHTML = `<small>₽</small>${expense}`;
    
    clearElem([increaseList, decreaseList, allList]);

    Entry_list.map((entry, index) => {
        if (entry.type === 'income') {
            showEntry(increaseList, entry.type, entry.title, entry.amount, index);
        }else if (entry.type === 'decrease') {
            showEntry(decreaseList, entry.type, entry.title, entry.amount, index);
        }else {
            showEntry(allList, entry.type, entry.title, entry.amount, index);
        } 
    })
    
    updateCircle(income, expense);
}

function clearElem(elements) {
    elements.forEach((element) => {
        element.innerHTML = '';
    })
}

//CIRCLE UPDATE
const canvas = document.createElement('canvas');
valueCircle.appendChild(canvas);

canvas.width = 60;
canvas.height = 60;

const ctx = canvas.getContext('2d');

const x = canvas.width/2;
const y = canvas.height/2;
const Radius = 25;

function drawCircle(color, ratio, anticlockwise) {
    ctx.strokeStyle = color
    ctx.beginPath();
    ctx.arc(x, y, Radius, 0, ratio * 2 * Math.PI, anticlockwise)
    ctx.stroke();
}


function updateCircle(income, expense) {
    let ratio = income/(income + expense);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCircle('#FFFFFF', -ratio, true);
    drawCircle('#F02B0F', 1 - ratio, false)
}
//calculate money balance
const calculateTotal = (type, entry_list) => {
    let result = entry_list.reduce((sum, item) => {
        if (item.type === type) {
            sum += item.amount  
        }
        return sum
    }, 0);
    return result
}
let income = calculateTotal('income', Entry_list);
let expense = calculateTotal('decrease', Entry_list);

function calculateBalance(income, expense) {
    return income - expense;
}
let totalBalance = calculateBalance(income, expense);


