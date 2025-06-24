const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const incomeDisplay = document.getElementById('total-income');
const expenseDisplay = document.getElementById('total-expense');
const balanceDisplay = document.getElementById('net-balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateTotals() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  incomeDisplay.textContent = income.toFixed(2);
  expenseDisplay.textContent = expense.toFixed(2);
  balanceDisplay.textContent = (income - expense).toFixed(2);
}

function addTransactionDOM(transaction) {
  const li = document.createElement('li');
  li.classList.add(transaction.type);
  li.innerHTML = `
    ${transaction.date} - ${transaction.description} [${transaction.category}]
    <strong>₹${transaction.amount.toFixed(2)}</strong>
    <button onclick="deleteTransaction(${transaction.id})">❌</button>
  `;
  list.appendChild(li);
}

function renderTransactions() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateTotals();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  renderTransactions();
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  if (!date || !description || !category || isNaN(amount) || amount <= 0) {
    alert("⚠️ Please enter all fields correctly.");
    return;
  }

  const transaction = {
    id: Date.now(),
    date,
    description,
    category,
    amount,
    type
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  form.reset();
});

renderTransactions();
