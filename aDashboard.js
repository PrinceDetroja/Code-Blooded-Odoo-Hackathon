let users = [
    {first:"Priya", last:"Sharma", email:"priya.s@example.com", dept:"Engineering", role:"Manager", reportsTo:"Sameer Desai"},
    {first:"Arjun", last:"Mehta", email:"arjun.m@example.com", dept:"Engineering", role:"Employee", reportsTo:"Priya Sharma"},
    {first:"Sneha", last:"Reddy", email:"sneha.r@example.com", dept:"Marketing", role:"Manager", reportsTo:"Sameer Desai"},
    {first:"Vikram", last:"Singh", email:"vikram.s@example.com", dept:"Marketing", role:"Employee", reportsTo:"Sneha Reddy"}
];

const tableBody = document.querySelector("#userTable tbody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const modal = document.getElementById("userModal");
const addUserBtn = document.getElementById("addUserBtn");
const closeButtons = document.querySelectorAll(".close-button, .close-button-footer");
const saveUserBtn = document.getElementById("saveUserBtn");
const modalTitle = document.getElementById("modalTitle");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const reportsToSelect = document.getElementById("reportsTo");

let editIndex = null;

function renderTable() {
    tableBody.innerHTML = "";
    users.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><span class="employee-name">${user.first} ${user.last}</span></td>
            <td>${user.email}</td>
            <td>${user.dept}</td>
            <td><span class="role-badge ${user.role==='Manager'?'role-manager':'role-employee'}">${user.role}</span></td>
            <td>${user.reportsTo}</td>
            <td class="action-buttons">
                <button class="btn-edit">✏ Edit</button>
                <button class="btn-delete">🗑 Delete</button>
            </td>
        `;
        // Edit
        row.querySelector(".btn-edit").addEventListener("click", () => openModal("Edit User", index));
        // Delete
        row.querySelector(".btn-delete").addEventListener("click", () => {
            if(confirm("Are you sure?")){
                users.splice(index,1);
                renderTable();
            }
        });
        tableBody.appendChild(row);
    });
}

function openModal(title, index=null){
    modal.style.display="flex";
    modalTitle.textContent=title;
    editIndex=index;

    if(index!==null){
        const u=users[index];
        firstNameInput.value=u.first;
        lastNameInput.value=u.last;
        emailInput.value=u.email;
        emailInput.readOnly=true;
        document.querySelector(`input[name="role"][value="${u.role}"]`).checked=true;
        reportsToSelect.innerHTML=`<option>${u.reportsTo}</option>`;
    } else {
        firstNameInput.value=""; lastNameInput.value=""; emailInput.value=""; emailInput.readOnly=false;
        reportsToSelect.innerHTML=`<option>Select Manager...</option>`;
    }
    // populate managers
    const managers=users.filter(u=>u.role==="Manager").map(u=>u.first+" "+u.last);
    managers.forEach(m=>{
        if(![...reportsToSelect.options].some(opt=>opt.value===m)){
            const opt=document.createElement("option");
            opt.value=m; opt.textContent=m; reportsToSelect.appendChild(opt);
        }
    });
}

function closeModal(){ modal.style.display="none"; }
closeButtons.forEach(btn=>btn.addEventListener("click", closeModal));
addUserBtn.addEventListener("click", ()=>openModal("Add New User"));

saveUserBtn.addEventListener("click", ()=>{
    const newUser={
        first:firstNameInput.value,
        last:lastNameInput.value,
        email:emailInput.value,
        dept:"N/A",
        role: document.querySelector('input[name="role"]:checked').value,
        reportsTo: reportsToSelect.value
    };
    if(editIndex!==null) users[editIndex]=newUser; else users.push(newUser);
    renderTable(); closeModal();
});

// Search & Filter
searchInput.addEventListener("input", ()=>{
    const term=searchInput.value.toLowerCase();
    const role=roleFilter.value;
    Array.from(tableBody.rows).forEach((row,i)=>{
        const user=users[i];
        const matchSearch=(user.first+user.last+user.email).toLowerCase().includes(term);
        const matchRole=role==="" || user.role===role;
        row.style.display=(matchSearch && matchRole)?"":"none";
    });
});
roleFilter.addEventListener("change", ()=>searchInput.dispatchEvent(new Event("input")));

// Initial render
renderTable();
