# SpendSphere
Smart Personal Money Manager - HTML, CSS, JS mini project
SpendSphere is a personal money manager website for students. It helps you record where your money comes from and where it goes, so you don’t lose track of it. It is built with HTML, CSS and vanilla JavaScript only, and it saves everything in the browser’s localStorage, so your data is still there after a refresh.

Its parts:

Dashboard: a welcome card with your available balance, plus cards for total income and total expenses. It also has an expense breakdown by category (made with CSS bars) and your 5 most recent transactions. All of it updates automatically when you add or delete a transaction.
Transactions: a form where you enter a title, amount, type (income or expense), category and date. It checks that all fields are filled and the amount is above zero, then shows a success or error message. Below it is a table of all transactions with coloured category labels and a delete button.
Budget: you set a monthly budget, and it shows the amount spent and the amount remaining. A progress bar fills as you spend and turns red with a warning if you go over.
Savings: you enter a goal name, a target amount and the amount saved. It shows the remaining amount and a progress bar.
About: a short note on why the website was made and how it helps.
Navigation: a navbar that jumps to each section, with a hamburger menu on phones.

The three files:

index.html holds the structure.
style.css holds the design: coloured theme, rounded cards and responsive layout.
script.js holds the logic: calculations, validation, updating the page and saving to localStorage.
