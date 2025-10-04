// Sections navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Dummy data
let expenses = [
    { employee: 'John Doe', amount: 100, currency: 'USD', category: 'Travel', description: 'Taxi fare', date: '2025-10-04', status: 'Pending' },
    { employee: 'Jane Smith', amount: 50, currency: 'USD', category: 'Food', description: 'Lunch', date: '2025-10-03', status: 'Pending' }
];

// Function to render expenses
function renderExpenses() {
    const tbody = document.querySelector('#expenseTable tbody');
    tbody.innerHTML = '';

    expenses.forEach((exp, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${exp.employee}</td>
            <td>${exp.amount}</td>
            <td>${exp.currency}</td>
            <td>${exp.category}</td>
            <td>${exp.description}</td>
            <td>${exp.date}</td>
            <td id="status-${index}">${exp.status}</td>
            <td>
                <button class="approve-btn" data-index="${index}" ${exp.status !== 'Pending' ? 'disabled' : ''}>Approve</button>
                <button class="reject-btn" data-index="${index}" ${exp.status !== 'Pending' ? 'disabled' : ''}>Reject</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = btn.dataset.index;
            expenses[idx].status = 'Approved';
            renderExpenses();
        });
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = btn.dataset.index;
            expenses[idx].status = 'Rejected';
            renderExpenses();
        });
    });
}

// Initial render
renderExpenses();

// --- Modal Logic for Add/Edit User ---
const modal = document.getElementById('userModal');
const addUserBtn = document.getElementById('addUserBtn');
const closeButton = document.querySelector('.close-button');
const cancelButton = document.querySelector('.close-button-footer');

function openModal() { modal.style.display = 'flex'; }
function closeModal() { modal.style.display = 'none'; }

addUserBtn.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);
cancelButton.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
});
