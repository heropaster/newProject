import { updateCircle } from "./circle.js";
//SELECT ELEMENTS
const balance = document.querySelector('.value');
const increaseTotal = document.querySelector('.increase_total');
const decreaseTotal = document.querySelector('.decrease_total');

//TOGGLING
const decreaseBtn = document.querySelector('.tab_1');
const increaseBtn = document.querySelector('.tab_2');
const allBtn = document.querySelector('.tab_3');
const deleteBtn = document.querySelector('#delete');
const editBtn = document.querySelector('#edit');

const increaseEl = document.querySelector('#increase');
const decreaseEl = document.querySelector('#decrease');
const allEl = document.querySelector('#all');

const increaseList = document.querySelector('#increase .list');
const decreaseList = document.querySelector('#decrease .list');
const allList = document.querySelector('#all .list');

const addDecrease = document.querySelector('.add_decrease');
const decreaseTitle = document.querySelector('#decrease_title_input');
const decreaseAmount = document.querySelector('#decrease_amount_input');

const addIncrease = document.querySelector('.add_increase');
const increaseTitle = document.querySelector('#increase_title_input');
const increaseAmount = document.querySelector('#increase_amount_input');

//variables
let Entry_list = [];
let income = 0, expense = 0;
//EVENTS
decreaseBtn.addEventListener('click', function() {
    active(decreaseBtn);
    inactive([increaseBtn, allBtn]);
    show(decreaseEl);
    hide([increaseEl, allEl]);
});

increaseBtn.addEventListener('click', function() {
    active(increaseBtn);
    inactive([decreaseBtn, allBtn]);
    show(increaseEl);
    hide([decreaseEl, allEl]);
});
allBtn.addEventListener('click', function() {
    active(allBtn);
    inactive([decreaseBtn, increaseBtn]);
    show(allEl);
    hide([increaseEl, decreaseEl]);
});

//Activating, unactivating

const active = (elem) => {
    elem.classList.add("active");
}
const inactive  = ([elem1, elem2]) => {
    elem1.classList.remove('active');
    elem2.classList.remove('active');
}

const show = (elem) => {
    elem.classList.remove('hide');
}
const hide = ([elem1, elem2]) => {
    elem1.classList.add('hide');
    elem2.classList.add('hide')
}
//add buttonsLogic and clear

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
    const entry = `<li id="${id}" class="${type}">
        <div class="entry">${title}: ₽${amount} </div>
        <div id="edit"></div>
        <div id="delete"></div>
    </li>`

    const position = 'afterbegin';
    list.insertAdjacentHTML(position, entry)
}

function deleteOrEdit(event) {
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if (targetBtn.id === 'delete') {
        deleteEntry(entry)
    }else if (targetBtn.id === 'edit') {
        editEntry(entry)
    }
}
document.addEventListener('click', function(e){
    if ((e.target && e.target.id === 'delete') || (e.target && e.target.id === 'edit')) {
        deleteOrEdit(e)
    }
})

const updateUI = () => {
    income = calculateTotal('income', Entry_list);
    expense = calculateTotal('decrease', Entry_list);
    totalBalance = Math.abs(calculateBalance(income, expense));

    let sign = (income >= expense) ? '₽' : '-₽';
    //UI
    
    balance.innerHTML = `<small>${sign}</small>${totalBalance}`;
    increaseTotal.innerHTML = `<small>₽</small>${income}`;
    decreaseTotal.innerHTML = `<small>₽</small>${expense}`;
    
    clearElem([increaseList, decreaseList, allList]);

    Entry_list.map((entry, index) => {
        if (entry.type === 'income') {
            showEntry(increaseList, entry.type, entry.title, entry.amount, index);
        }else if (entry.type === 'decrease') {
            showEntry(decreaseList, entry.type, entry.title, entry.amount, index);
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index);
         
    })
    
    updateCircle(income, expense);
}

function clearElem(elements) {
    elements.forEach((element) => {
        element.innerHTML = '';
    })
}
//1

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
income = calculateTotal('income', Entry_list);
expense = calculateTotal('decrease', Entry_list);

function calculateBalance(income, expense) {
    return income - expense;
}
let totalBalance = calculateBalance(income, expense);


