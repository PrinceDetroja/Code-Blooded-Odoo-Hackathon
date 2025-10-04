const sections = document.querySelectorAll('.section');
function showSection(id){
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Sample data
let expenses = [
    {amount: 100, currency:"USD", category:"Travel", description:"Taxi fare", date:"2025-10-01", status:"Pending"},
    {amount: 50, currency:"USD", category:"Food", description:"Lunch", date:"2025-10-02", status:"Approved"},
    {amount: 200, currency:"USD", category:"Accommodation", description:"Hotel stay", date:"2025-10-03", status:"Rejected"},
    {amount: 75, currency:"USD", category:"Food", description:"Dinner", date:"2025-10-04", status:"Pending"}
];

// Update dashboard stats
function updateDashboard(){
    const total = expenses.reduce((sum,e)=>sum+e.amount,0);
    const pending = expenses.filter(e=>e.status==="Pending").length;
    const approved = expenses.filter(e=>e.status==="Approved").length;
    const rejected = expenses.filter(e=>e.status==="Rejected").length;

    document.getElementById("totalExpenses").innerText="$"+total;
    document.getElementById("pendingRequests").innerText=pending;
    document.getElementById("approvedRequests").innerText=approved;
    document.getElementById("rejectedRequests").innerText=rejected;

    const recentBody = document.querySelector("#recentExpensesTable tbody");
    recentBody.innerHTML="";
    expenses.slice(-5).reverse().forEach(e=>{
        const row = document.createElement("tr");
        row.innerHTML=`
            <td>${e.amount}</td>
            <td>${e.currency}</td>
            <td>${e.category}</td>
            <td>${e.description}</td>
            <td>${e.date}</td>
            <td>${e.status}</td>
        `;
        recentBody.appendChild(row);
    });
}

// Submit expense form
document.getElementById("expenseForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    const newExpense = {
        amount: Number(document.getElementById("amount").value),
        currency: document.getElementById("currency").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        date: document.getElementById("date").value,
        status: "Pending"
    };
    expenses.push(newExpense);
    updateDashboard();
    alert("Expense claim submitted!");
    e.target.reset();
});

// Initialize dashboard
updateDashboard();
