// Navigation toggle
function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(section => section.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

// Expense form submission
const expenseForm = document.getElementById("expenseForm");
const historyTable = document.getElementById("historyTable").querySelector("tbody");

expenseForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const currency = document.getElementById("currency").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const date = document.getElementById("date").value;

  const row = historyTable.insertRow();
  row.insertCell(0).innerText = amount;
  row.insertCell(1).innerText = currency;
  row.insertCell(2).innerText = category;
  row.insertCell(3).innerText = description;
  row.insertCell(4).innerText = date;
  row.insertCell(5).innerText = "Pending";

  expenseForm.reset();

  // Automatically switch to history section after submission
  showSection("history");
});
