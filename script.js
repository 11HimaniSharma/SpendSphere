
// Getting elements from HTML
const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");

// Getting previously saved information
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let weeklyLimit = Number(localStorage.getItem("weeklyLimit")) || 0;

let savingsGoal = JSON.parse(localStorage.getItem("savingsGoal")) || {
    name: "",
    target: 0,
    saved: 0
};

// Today's date
const today = new Date();

document.getElementById("todayDate").textContent =
    today.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

document.getElementById("date").value =
    today.toISOString().split("T")[0];


// Convert amount into rupees
function formatMoney(amount) {
    return "₹" + amount.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}


// Save transactions in browser storage
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}


// Add a new entry
transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (title === "" || amount <= 0 || date === "") {
        alert("Please enter valid details.");
        return;
    }

    const newEntry = {
        id: Date.now(),
        title: title,
        amount: amount,
        type: type,
        category: category,
        date: date
    };

    transactions.push(newEntry);

    saveTransactions();

    transactionForm.reset();

    document.getElementById("date").value =
        today.toISOString().split("T")[0];

    updateWebsite();
});


// Calculate total income, expenses and balance
function updateSummary() {

    let totalIncome = 0;
    let totalExpense = 0;

    for (let i = 0; i < transactions.length; i++) {

        if (transactions[i].type === "income") {
            totalIncome = totalIncome + transactions[i].amount;
        } else {
            totalExpense = totalExpense + transactions[i].amount;
        }
    }

    let balance = totalIncome - totalExpense;

    incomeElement.textContent = formatMoney(totalIncome);
    expenseElement.textContent = formatMoney(totalExpense);
    balanceElement.textContent = formatMoney(balance);
}


// Display entries in the spending diary
function displayTransactions() {

    transactionList.innerHTML = "";

    const emptyMessage = document.getElementById("emptyMessage");

    if (transactions.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    // Display the latest entry first
    for (let i = transactions.length - 1; i >= 0; i--) {

        const item = transactions[i];

        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = item.title;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = item.category;

        const dateCell = document.createElement("td");

        dateCell.textContent = new Date(item.date + "T00:00:00")
            .toLocaleDateString("en-IN");

        const typeCell = document.createElement("td");
        typeCell.textContent =
            item.type === "income" ? "Received" : "Spent";

        if (item.type === "income") {
            typeCell.className = "income-type";
        } else {
            typeCell.className = "expense-type";
        }

        const amountCell = document.createElement("td");
        amountCell.textContent = formatMoney(item.amount);

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(item.id);
        });

        actionCell.appendChild(deleteButton);

        row.appendChild(titleCell);
        row.appendChild(categoryCell);
        row.appendChild(dateCell);
        row.appendChild(typeCell);
        row.appendChild(amountCell);
        row.appendChild(actionCell);

        transactionList.appendChild(row);
    }
}


// Delete an entry
function deleteTransaction(id) {

    transactions = transactions.filter(function(item) {
        return item.id !== id;
    });

    saveTransactions();

    updateWebsite();
}


// Find expenses made during the current week
function getWeeklyExpense() {

    const currentDate = new Date();

    const day = currentDate.getDay();

    // Find Monday of the current week
    const monday = new Date(currentDate);

    monday.setDate(currentDate.getDate() - (day === 0 ? 6 : day - 1));
    monday.setHours(0, 0, 0, 0);

    // Find Sunday of the current week
    const sunday = new Date(monday);

    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    let total = 0;

    for (let i = 0; i < transactions.length; i++) {

        const entryDate = new Date(
            transactions[i].date + "T00:00:00"
        );

        if (
            transactions[i].type === "expense" &&
            entryDate >= monday &&
            entryDate <= sunday
        ) {
            total = total + transactions[i].amount;
        }
    }

    return total;
}


// Save weekly spending limit
document.getElementById("saveLimit").addEventListener("click", function() {

    const limit = Number(
        document.getElementById("weeklyLimit").value
    );

    if (limit <= 0) {
        alert("Please enter a valid weekly limit.");
        return;
    }

    weeklyLimit = limit;

    localStorage.setItem("weeklyLimit", weeklyLimit);

    updateWeeklyLimit();

    alert("Your weekly limit has been saved!");
});


// Update weekly spending information
function updateWeeklyLimit() {

    const spent = getWeeklyExpense();

    const remaining = weeklyLimit - spent;

    document.getElementById("weekSpent").textContent =
        formatMoney(spent);

    document.getElementById("weekRemaining").textContent =
        formatMoney(remaining);

    let percentage = 0;

    if (weeklyLimit > 0) {
        percentage = (spent / weeklyLimit) * 100;
    }

    if (percentage > 100) {
        percentage = 100;
    }

    document.getElementById("weekProgress").style.width =
        percentage + "%";

    const message = document.getElementById("weekMessage");

    if (weeklyLimit === 0) {
        message.textContent = "Set a weekly limit to start.";
    } else if (spent > weeklyLimit) {
        message.textContent =
            "Oops! You have crossed your weekly spending limit.";
    } else if (spent === weeklyLimit) {
        message.textContent =
            "You have used your entire weekly budget.";
    } else {
        message.textContent =
            "You still have " + formatMoney(remaining) +
            " left for this week. Keep going!";
    }
}


// Save a savings goal
document.getElementById("saveGoal").addEventListener("click", function() {

    const name = document.getElementById("goalName").value.trim();

    const target = Number(
        document.getElementById("goalTarget").value
    );

    const saved = Number(
        document.getElementById("goalSaved").value
    );

    if (name === "" || target <= 0 || saved < 0 || saved > target) {
        alert("Please enter a valid savings goal.");
        return;
    }

    savingsGoal = {
        name: name,
        target: target,
        saved: saved
    };

    localStorage.setItem("savingsGoal", JSON.stringify(savingsGoal));

    updateSavings();

    alert("Your savings goal has been saved!");
});


// Display savings progress
function updateSavings() {

    const title = document.getElementById("goalTitle");
    const details = document.getElementById("goalDetails");
    const progress = document.getElementById("goalProgress");

    if (savingsGoal.target === 0) {
        title.textContent = "My little goal";
        details.textContent = "Your savings progress will appear here.";
        progress.style.width = "0%";
        return;
    }

    const remaining = savingsGoal.target - savingsGoal.saved;

    const percentage =
        (savingsGoal.saved / savingsGoal.target) * 100;

    title.textContent = savingsGoal.name;

    if (remaining === 0) {
        details.textContent = "You reached your savings goal! Well done!";
    } else {
        details.textContent =
            formatMoney(savingsGoal.saved) + " saved and " +
            formatMoney(remaining) + " to go.";
    }

    progress.style.width = percentage + "%";
}


// Show spending category breakdown
function updateCategoryBreakdown() {

    const categoryList = document.getElementById("categoryBreakdown");

    categoryList.innerHTML = "";

    const categories = [
        "Canteen / Snacks",
        "Mess",
        "Travel / Auto",
        "Stationery",
        "Photocopies / Notes",
        "Shopping",
        "Mobile Recharge",
        "Outings",
        "Hostel Essentials",
        "Other"
    ];

    let totalExpense = 0;

    // Calculate all expenses
    for (let i = 0; i < transactions.length; i++) {

        if (transactions[i].type === "expense") {
            totalExpense += transactions[i].amount;
        }
    }

    // Calculate spending in each category
    for (let i = 0; i < categories.length; i++) {

        let categoryTotal = 0;

        for (let j = 0; j < transactions.length; j++) {

            if (
                transactions[j].type === "expense" &&
                transactions[j].category === categories[i]
            ) {
                categoryTotal += transactions[j].amount;
            }
        }

        let percentage = 0;

        if (totalExpense > 0) {
            percentage = (categoryTotal / totalExpense) * 100;
        }

        const row = document.createElement("div");
        row.className = "category-row";

        const name = document.createElement("span");
        name.className = "category-name";
        name.textContent = categories[i];

        const track = document.createElement("div");
        track.className = "category-track";

        const fill = document.createElement("div");
        fill.className = "category-fill";
        fill.style.width = percentage + "%";

        track.appendChild(fill);

        const amount = document.createElement("span");
        amount.className = "category-amount";
        amount.textContent = formatMoney(categoryTotal);

        row.appendChild(name);
        row.appendChild(track);
        row.appendChild(amount);

        categoryList.appendChild(row);
    }
}


// Update the complete website
function updateWebsite() {

    updateSummary();

    displayTransactions();

    updateWeeklyLimit();

    updateSavings();

    updateCategoryBreakdown();
}


// Put saved information back into the input boxes
document.getElementById("weeklyLimit").value =
    weeklyLimit || "";

document.getElementById("goalName").value =
    savingsGoal.name;

document.getElementById("goalTarget").value =
    savingsGoal.target || "";

document.getElementById("goalSaved").value =
    savingsGoal.saved || "";


// Display saved data when the website opens
updateWebsite();
