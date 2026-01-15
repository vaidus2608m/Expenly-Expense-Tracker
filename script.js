const datePic = document.querySelector("#currentMonth");

let transactions = [];

const totalCard = document.querySelector(".total-card");
const incomeCard = document.querySelector(".income-card");
const expenseCard = document.querySelector(".expense-card");

const totalBalanceEl = document.querySelector("#totalBalance");
const totalIncomeEl = document.querySelector("#totalIncome");
const totalExpenseEl = document.querySelector("#totalExpense");

let totalBalance = 0;
let totalIncome = 0;
let totalExpense = 0;

const form = document.querySelector("#transactionForm");
const list = document.querySelector(".activity-list");


const chart = document.querySelector("#donutChart");
const legend = document.querySelector(".legend");
const incomeP = document.createElement("p");
const expenseP = document.createElement("p");

legend.append(incomeP, expenseP);


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const nowDate = new Date();
const month = nowDate.getMonth();
const year = nowDate.getFullYear();

datePic.textContent = `${months[month]} ${year}`


function formatMoney(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(n);
}

function saveToTransaction(){
  const data = {
    transactions,
    totalIncome,
    totalExpense,
    totalBalance
  };

  localStorage.setItem("EXPENLY-DATA", JSON.stringify(data));
}

function updateTransaction(event) {
  event.preventDefault();

  const element = document.createElement("li");

  const transectionType = document.querySelector(
    'input[name="type"]:checked'
  ).value;

  const amount = document.querySelector("#amountInput").value;
  const category = document.querySelector("#categoryInput").value;
  const method = document.querySelector("#methodInput").value;

  const currAmount = Number(amount);

  if (!currAmount || currAmount <= 0 || !Number.isFinite(currAmount)) {
    alert("Enter Valid Amount");
    return;
  }

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("info");
  infoDiv.innerHTML = `
    <strong>${category}</strong>
    <span>${method}</span>
  `;

  const amountSpan = document.createElement("span");
  amountSpan.classList.add("amount");
  amountSpan.classList.add(transectionType === "income" ? "green" : "red");
  amountSpan.textContent = `${
    transectionType === "income" ? "+" : "-"
  }₹${amount}`;

  element.appendChild(infoDiv);
  element.appendChild(amountSpan);

  list.append(element);

  // UPDATING BALANCES

  if (transectionType == "income") {
    totalIncome += currAmount;
    totalBalance += currAmount;
  } else {
    totalExpense += currAmount;
    totalBalance -= currAmount;
  }

  totalBalanceEl.textContent = formatMoney(totalBalance);
  totalIncomeEl.textContent = formatMoney(totalIncome);
  totalExpenseEl.textContent = formatMoney(totalExpense);

  transactions.push({
    type: transectionType,
    amount: currAmount,
    category,
    method,
  });

  saveToTransaction();
  updateChart();

  event.target.reset();
}

function updateChart() {
  const total = totalExpense + totalIncome;

  if (total === 0) {
    chart.style.background = "conic-gradient(#cbd5e1 0% 100%)";
    incomeP.textContent = "";
    expenseP.textContent = "";
    return;
  }

  const incomePercent = (totalIncome / total) * 100;
  const expensePercent = (totalExpense / total) * 100;

  chart.style.background = `conic-gradient(
    #10b981 0% ${incomePercent}%,
    #ef4444 ${incomePercent}% 100%
  )`;

  incomeP.textContent = `Income: ${incomePercent.toFixed(0)}%`;
  expenseP.textContent = `Expense: ${expensePercent.toFixed(0)}%`;
}


form.addEventListener("submit", updateTransaction);



function loadFromStorage() {
  const savedData = localStorage.getItem("EXPENLY-DATA");
  if(!savedData) return;

  const data = JSON.parse(savedData);

  transactions = data.transactions || [];
  totalIncome = data.totalIncome || 0;
  totalExpense = data.totalExpense || 0;
  totalBalance = data.totalBalance || 0;

  totalIncomeEl.textContent = formatMoney(totalIncome);
  totalExpenseEl.textContent = formatMoney(totalExpense);
  totalBalanceEl.textContent = formatMoney(totalBalance);


  transactions.forEach((txn) => {
    const li = document.createElement("li");

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("info");
    infoDiv.innerHTML = `
      <strong>${txn.category}</strong>
      <span>${txn.method}</span>
    `;

    const amountSpan = document.createElement("span");
    amountSpan.classList.add("amount");
    amountSpan.classList.add(txn.type === "income" ? "green" : "red");
    amountSpan.textContent =
      `${txn.type === "income" ? "+" : "-"}${formatMoney(txn.amount)}`;

    li.appendChild(infoDiv);
    li.appendChild(amountSpan);
    list.appendChild(li);
  });

  updateChart();
}


loadFromStorage();
