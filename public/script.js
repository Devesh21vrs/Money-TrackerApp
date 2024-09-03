let expenses = [];
let totalAmount = 0;
const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amount_input');
const infoInput = document.getElementById('info');
const dateInput = document.getElementById('date_input');
const addBtn = document.getElementById('add_btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

function fetchRecords() {
    fetch('/records')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched records:', data);
            expenses = data;
            updateExpenseTable();
        })
        .catch(error => console.error('Error fetching records:', error));
}

function updateExpenseTable() {
    expenseTableBody.innerHTML = '';
    totalAmount = 0;

    expenses.forEach((expense) => {
        if (expense.Category === 'Income') {
            totalAmount += Number(expense.Amount);
        } else if (expense.Category === 'Expense') {
            totalAmount -= Number(expense.Amount);
        }

        const newRow = expenseTableBody.insertRow();
        newRow.insertCell().textContent = expense.Category;
        newRow.insertCell().textContent = expense.Amount;
        newRow.insertCell().textContent = expense.Info;
        newRow.insertCell().textContent = expense.Date;

        const deleteCell = newRow.insertCell();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => deleteExpense(expense._id);
        deleteCell.appendChild(deleteBtn);
    });

    totalAmountCell.textContent = totalAmount.toFixed(2);
}

function deleteExpense(id) {
    fetch(`/delete/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Delete successful:', data);
            fetchRecords();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete expense. Please try again.');
        });
}

addBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const info = infoInput.value;
    const date = dateInput.value;

    if (category === '' || isNaN(amount) || amount <= 0 || info === '' || date === '') {
        alert('Please fill all fields with valid values');
        return;
    }

    const newExpense = { 
        category_select: category, 
        amount_input: amount, 
        info: info, 
        date_input: date 
    };

    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        fetchRecords(); 

        categorySelect.value = '';
        amountInput.value = '';
        infoInput.value = '';
        dateInput.value = '';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to add expense. Please try again.');
    });
});


fetchRecords();