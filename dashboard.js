document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.exchangerate-api.com/v4/latest/%7BBASE_CURRENCY"; // your backend base URL
  const employeeId = 1; // for now, hardcode or get from login/session

  const sections = document.querySelectorAll(".section");

  // Function to toggle visible section
  window.showSection = function (id) {
    sections.forEach((sec) => sec.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    // Fetch data when switching to history or dashboard
    if (id === "dashboard" || id === "history") {
      fetchExpenses();
    }
  };

  // --- Fetch Expenses from Backend ---
  async function fetchExpenses() {
    try {
      const res = await fetch(`${API_URL}/expense/${employeeId}`);
      const expenses = await res.json();
      updateDashboard(expenses);
      updateHistory(expenses);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  }

  // --- Update Dashboard Section ---
  function updateDashboard(expenses) {
    if (!expenses.length) return;

    const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const pending = expenses.filter((e) => e.status === "Pending").length;
    const approved = expenses.filter((e) => e.status === "Approved").length;
    const rejected = expenses.filter((e) => e.status === "Rejected").length;

    document.getElementById("totalExpenses").innerText = "$" + total.toFixed(2);
    document.getElementById("pendingRequests").innerText = pending;
    document.getElementById("approvedRequests").innerText = approved;
    document.getElementById("rejectedRequests").innerText = rejected;

    const recentBody = document.querySelector("#recentExpensesTable tbody");
    recentBody.innerHTML = "";
    expenses.slice(-5).reverse().forEach((e) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${e.amount}</td>
        <td>${e.currency}</td>
        <td>${e.category}</td>
        <td>${e.description || "-"}</td>
        <td>${e.expense_date?.split("T")[0]}</td>
        <td>${e.status}</td>
      `;
      recentBody.appendChild(row);
    });
  }

  // --- Update Expense History Section ---
  function updateHistory(expenses) {
    const historyBody = document.querySelector("#historyTable tbody");
    historyBody.innerHTML = "";
    expenses.forEach((e) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${e.amount}</td>
        <td>${e.currency}</td>
        <td>${e.category}</td>
        <td>${e.description || "-"}</td>
        <td>${e.expense_date?.split("T")[0]}</td>
        <td>${e.status}</td>
      `;
      historyBody.appendChild(row);
    });
  }

  // --- Submit Expense Form ---
  document
    .getElementById("expenseForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const amount = document.getElementById("amount").value;
      const currency = document.getElementById("currency").value;
      const category = document.getElementById("category").value;
      const description = document.getElementById("description").value;
      const expense_date = document.getElementById("date").value;

      const expenseData = {
        employee_id: employeeId,
        amount,
        currency,
        category,
        description,
        expense_date,
      };

      try {
        const response = await fetch(`${API_URL}/expense`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseData),
        });

        const data = await response.json();
        if (response.ok) {
          alert("Expense submitted successfully!");
          e.target.reset();
          fetchExpenses(); // refresh dashboard
          showSection("dashboard");
        } else {
          alert("Error: " + data.message);
        }
      } catch (err) {
        console.error("Error submitting expense:", err);
      }
    });

  // Load dashboard on startup
  fetchExpenses();
});
