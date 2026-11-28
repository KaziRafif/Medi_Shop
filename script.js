const title = document.title;

// COMMON: LOGOUT, LOGIN, CREATE ACCOUNT

const logoutBtn = document.querySelector(".logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "Login.html";
  });
}

// Login:
if (title === "Login") {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const role = document.getElementById("log").value;
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;

    if (email === "" || pass === "") {
      alert("Enter email and password.");
      return;
    }

    // registered 
    const savedRole = localStorage.getItem("userRole");
    const savedEmail = localStorage.getItem("userEmail");
    const savedPass = localStorage.getItem("userPass");
    const isSavedUser = (role === savedRole && email === savedEmail && pass === savedPass);

    
    if (role === "Admin" && ((email === "admin@gmail.com" && pass === "1234") || isSavedUser)) {
      window.location.href = "Admindeshboard.html";
    } 
    else if (role === "Pharmacist" && ((email === "pharmacist@gmail.com" && pass === "1234") || isSavedUser)) {
      window.location.href = "PharmacistDashboard.html";
    } 
    else if (role === "Customer" && ((email === "customer@gmail.com" && pass === "1234") || isSavedUser)) {
      window.location.href = "CustomerBrowseMedicine.html";
    } 
    else {
      alert("Wrong email, password, or role!");
    }
  });
}

// Create Account: 
if (title === "Create Account") {
  const registerForm = document.querySelector("form");

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const role = document.getElementById("reg").value;
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (email === "" || pass === "" || pass !== confirm) {
      alert("Enter valid email and matching passwords.");
      return;
    }

    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPass", pass);

    alert("Account created!");
    window.location.href = "Login.html";
  });
}

// ADMIN PANEL

// Admin Dashboard:
if (title === "MediShop Admin Dashboard") {
  const fieldsets = document.querySelectorAll("fieldset");
  const savedCount = localStorage.getItem("medCount");

  if (savedCount) {
    fieldsets[1].querySelector("h2").textContent = savedCount;
  }

  const quickLinks = [
    "AdminMedicines.html",
    "AdminCategories.html",
    "AdminOrders.html",
    "AdminPharmacist.html"
  ];

  fieldsets[3].querySelectorAll('input[type="button"]').forEach(function (btn, index) {
    btn.addEventListener("click", function () {
      window.location.href = quickLinks[index];
    });
  });
}

//admin Medicines
if (title === "Admin-Medicines") {
  const fieldsets = document.querySelectorAll("fieldset");
  const form = fieldsets[1].querySelector("form");
  const inputs = form.querySelectorAll('input[type="text"]');
  const categorySelect = form.querySelector("select");
  const expiryInput = form.querySelector('input[type="date"]');
  const saveBtn = form.querySelector('input[value="Save medicine"]');
  const cancelBtn = form.querySelector('input[value="Cancel"]');
  const table = fieldsets[2].querySelector("table");

  let editRow = null;

  function resetMedicineForm() {
    form.reset();
    editRow = null;
    saveBtn.value = "Save medicine";
  }

  function setupRowButtons(row) {
    
    row.querySelector('input[value="Edit"]').addEventListener("click", function () {
      editRow = row;
      inputs[0].value = row.cells[0].textContent.trim();
      categorySelect.value = row.cells[1].textContent.trim();
      inputs[1].value = row.cells[2].textContent.trim();
      inputs[2].value = parseInt(row.cells[3].textContent);
      inputs[3].value = parseInt(row.cells[4].textContent);
      saveBtn.value = "Update medicine";
    });

    //Delete row and update Dashboard
    row.querySelector('input[value="Delete"]').addEventListener("click", function () {
      if (editRow === row) {
        resetMedicineForm();
      }
      row.remove();
      localStorage.setItem("medCount", table.rows.length - 1);
    });
  }

  
  for (let i = 1; i < table.rows.length; i++) {
    setupRowButtons(table.rows[i]);
  }

  
  saveBtn.addEventListener("click", function () {
    const name = inputs[0].value.trim();
    const vendor = inputs[1].value.trim();
    const price = inputs[2].value.trim();
    const stock = inputs[3].value.trim();
    const expiry = expiryInput.value;

    if (name === "") {
      alert("Medicine name is required.");
      return;
    }

    if (editRow === null) {
    
      editRow = document.createElement("tr");
      editRow.align = "center";
      editRow.innerHTML =
        "<td></td><td></td><td></td><td></td><td></td><td></td>" +
        '<td><input type="button" value="Edit"> <input type="button" value="Delete"></td>';
      table.appendChild(editRow);
      setupRowButtons(editRow);
      localStorage.setItem("medCount", table.rows.length - 1);
    }

  
    editRow.cells[0].textContent = name;
    editRow.cells[1].textContent = categorySelect.value;
    editRow.cells[2].textContent = vendor;
    editRow.cells[3].textContent = price + " tk";
    editRow.cells[4].textContent = stock;
    if (expiry !== "") {
      editRow.cells[5].textContent = expiry;
    }

    resetMedicineForm();
  });

  cancelBtn.addEventListener("click", resetMedicineForm);
}

// Admin Categories
if (title === "Manage Categories") {
  const form = document.querySelector("form");
  const nameInput = form.querySelector('input[type="text"]');
  const typeSelect = form.querySelector("select");

  let editRow = null;

  document.querySelectorAll("table button:not(.danger)").forEach(function (btn) {
    btn.addEventListener("click", function () {
      editRow = btn.closest("tr");
      nameInput.value = editRow.cells[1].textContent.trim();
      typeSelect.value = editRow.cells[2].textContent.trim();
    });
  });

  document.querySelectorAll("table button.danger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      alert("Delete is only allowed on Medicines page.");
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (editRow === null) {
      alert("Click Edit first.");
      return;
    }

    editRow.cells[1].textContent = nameInput.value.trim();
    editRow.cells[2].textContent = typeSelect.value;
    editRow = null;
    form.reset();
  });
}

// 2.4 Admin Orders: UPDATE Only
if (title === "Orders") {
  document.querySelectorAll('input[value="Update"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      alert("Order updated!");
    });
  });
}

// Admin reviews& pharmacists
if (title === "MediShop Admin - Reviews" || title === "MediShop Admin - Pharmacists") {
  document.querySelectorAll('table input[type="button"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      const statusBadge = btn.closest("tr").querySelector(".status");

      if (btn.value === "Approve") {
        statusBadge.textContent = (title === "MediShop Admin - Reviews") ? "Approved" : "Active";
        statusBadge.className = "status ok";
      } else {
        statusBadge.textContent = btn.value + "ed";
        statusBadge.className = "status bad";
      }
    });
  });
}

//Admin Customers
if (title === "MediShop Admin - Customers") {
  document.querySelectorAll('input[value="View"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      const row = btn.closest("tr");
      alert(row.cells[0].textContent + " - " + row.cells[1].textContent);
    });
  });

  document.querySelectorAll('input[value="Block"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.value === "Block") {
        btn.value = "Unblock";
        btn.className = "green";
      } else {
        btn.value = "Block";
        btn.className = "danger";
      }
    });
  });
}

// Admin Expiry & Damaged
if (title === "Expiry and damaged") {
  document.querySelectorAll('input[value="Mark damaged"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.value = "Damaged";
      btn.className = "danger";
    });
  });

  document.querySelector('input[value="Save report"]').addEventListener("click", function () {
    alert("Damaged report updated!");
  });
}

// Search
if (title === "Admin-Medicines" || title === "Orders" || title === "MediShop Admin - Customers") {
  const searchBox = document.querySelector('input[placeholder^="Search"]');

  if (searchBox && searchBox.form) {
    searchBox.form.addEventListener("submit", function (event) {
      event.preventDefault();
    });

    searchBox.addEventListener("input", function () {
      const searchText = searchBox.value.trim().toLowerCase();
      const tables = document.querySelectorAll("table");
      const targetTable = tables[tables.length - 1];

      for (let i = 1; i < targetTable.rows.length; i++) {
        const rowText = targetTable.rows[i].textContent.toLowerCase();
        targetTable.rows[i].style.display = rowText.includes(searchText) ? "" : "none";
      }
    });
  }
}

// 3. PHARMACIST PANEL

// Dashboard
if (title === "MediShop Pharmacist - Dashboard") {
  document.querySelectorAll('input[value="Verify"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      const badge = btn.closest("tr").querySelector(".badge");
      badge.textContent = "Verified";
      badge.className = "badge ok";
      btn.value = "View";
    });
  });

  document.querySelector('input[value="Verify prescriptions"]').addEventListener("click", function () {
    window.location.href = "PharmacistPrescriptions.html";
  });

  document.querySelector('input[value="Set purchase limits"]').addEventListener("click", function () {
    window.location.href = "PharmacistPurchaseLimit.html";
  });

  document.querySelector('input[value="Confirm payment"]').addEventListener("click", function () {
    window.location.href = "PharmacistPayments.html";
  });
}

//Prescriptions
if (title === "MediShop - Pharmacist Panel") {
  const reviewForm = document.getElementById("prescriptionReviewForm");
  const rejectBtn = document.getElementById("rejectRxBtn");

  document.querySelectorAll('input[value="Open"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      const row = btn.closest("tr");
      document.getElementById("selectedOrderTitle").textContent = "Order " + row.cells[0].textContent + " prescription";
      document.getElementById("rxCustomer").textContent = row.cells[1].textContent;
      document.getElementById("rxMedicine").textContent = row.cells[2].textContent;
    });
  });

  reviewForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Prescription approved!");
  });

  rejectBtn.addEventListener("click", function () {
    alert("Prescription rejected!");
  });
}

//  Purchase Limits
if (title === "MediShop Pharmacist - Purchase Limits") {
  const form = document.getElementById("purchaseLimitForm");
  const medSelect = document.getElementById("medicine");
  const custSelect = document.getElementById("customer");
  const maxQtyInput = document.getElementById("max_qty");
  const periodSelect = document.getElementById("period");
  const saveBtn = form.querySelector('input[type="submit"]');
  const table = document.querySelectorAll("fieldset")[1].querySelector("table");

  let editRow = null;

  function resetLimitForm() {
    form.reset();
    editRow = null;
    saveBtn.value = "Save limit";
  }


  function selectByText(selectEl, text) {
    for (let i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].text === text) {
        selectEl.selectedIndex = i;
        break;
      }
    }
  }

  function setupLimitRow(row) {
    
    row.querySelector('input[value="Edit"]').addEventListener("click", function () {
      editRow = row;
      selectByText(medSelect, row.cells[0].textContent.trim());
      selectByText(custSelect, row.cells[1].textContent.trim());
      maxQtyInput.value = row.cells[2].textContent.trim();
      selectByText(periodSelect, row.cells[3].textContent.trim());
      saveBtn.value = "Update limit";
    });

   
    row.querySelector('input[value="Remove"]').addEventListener("click", function () {
      if (editRow === row) {
        resetLimitForm();
      }
      row.remove();
    });
  }

 
  for (let i = 1; i < table.rows.length; i++) {
    setupLimitRow(table.rows[i]);
  }

  
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const medText = medSelect.options[medSelect.selectedIndex].text;
    const custText = custSelect.options[custSelect.selectedIndex].text;
    const qty = maxQtyInput.value.trim();
    const periodText = periodSelect.options[periodSelect.selectedIndex].text;

    if (qty === "" || Number(qty) < 1) {
      alert("Please enter a valid maximum quantity.");
      return;
    }

    if (editRow !== null) {
      
      editRow.cells[0].textContent = medText;
      editRow.cells[1].textContent = custText;
      editRow.cells[2].textContent = qty;
      editRow.cells[3].textContent = periodText;
      alert("Purchase limit updated!");
    } else {
    
      const tr = document.createElement("tr");
      tr.align = "center";
      tr.innerHTML =
        "<td>" + medText + "</td>" +
        "<td>" + custText + "</td>" +
        "<td>" + qty + "</td>" +
        "<td>" + periodText + "</td>" +
        '<td><input type="button" value="Edit"> <input type="button" class="danger" value="Remove"></td>';
      table.appendChild(tr);
      setupLimitRow(tr);
      alert("Purchase limit added!");
    }

    resetLimitForm();
  });
}

//Payments
if (title === "MediShop Pharmacist - Payments") {
  const filterForm = document.getElementById("paymentFilterForm");
  const verifyForm = document.getElementById("verifyPaymentForm");

  document.querySelectorAll('input[value="Confirm"], input[value="Reject"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      const badge = btn.closest("tr").querySelector(".badge");
      if (btn.value === "Confirm") {
        badge.textContent = "Confirmed";
        badge.className = "badge ok";
      } else {
        badge.textContent = "Rejected";
        badge.className = "badge bad";
      }
    });
  });

  filterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Payment list filtered!");
  });

  verifyForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Payment status updated!");
  });
}

//Orders
if (title === "MediShop Pharmacist - Orders") {
  const orderForm = document.getElementById("orderStatusForm");

  document.querySelectorAll('input[value="Mark handed over"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      const badges = btn.closest("tr").querySelectorAll(".badge");
      badges[2].textContent = "Handed over";
      badges[2].className = "badge ok";
    });
  });

  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Order status updated!");
  });
}

//Stock Check
if (title === "MediShop Pharmacist - Stock Check") {
  const searchForm = document.getElementById("stockSearchForm");
  const searchInput = document.getElementById("q");
  const table = document.querySelector("table");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchText = searchInput.value.trim().toLowerCase();

    for (let i = 1; i < table.rows.length; i++) {
      const rowText = table.rows[i].textContent.toLowerCase();
      table.rows[i].style.display = rowText.includes(searchText) ? "" : "none";
    }
  });
}

//My Profile
if (title === "MediShop Pharmacist - My Profile") {
  const profileForm = document.getElementById("profileForm");
  const cancelBtn = document.getElementById("cancelProfileBtn");

  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Profile updated!");
  });

  cancelBtn.addEventListener("click", function () {
    profileForm.reset();
  });
}

// 4. CUSTOMER PANEL


// Browse Medicines
if (title === "MediShop - Browse Medicines") {
  document.querySelectorAll('input[value="Add to cart"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      const medName = btn.closest("fieldset").querySelector("h3").textContent;
      alert(medName + " added to cart!");
    });
  });
}

// Checkout
if (title === "MediShop - Checkout") {
  const placeOrderBtn = document.querySelector('input[value="Place order"]');
  const cancelBtn = document.querySelector('input[value="Cancel"]');

  placeOrderBtn.addEventListener("click", function () {
    if (!document.getElementById("terms").checked) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    alert("Order placed successfully!");
    window.location.href = "CustomerMyOrder.html";
  });

  cancelBtn.addEventListener("click", function () {
    window.location.href = "CustomerBrowseMedicine.html";
  });
}

// My Orders
if (title === "MediShop - My Orders") {
  const browseBtn = document.querySelector('input[value="Browse medicines"]');

  browseBtn.addEventListener("click", function () {
    window.location.href = "CustomerBrowseMedicine.html";
  });
}

// Upload Prescription
if (title === "MediShop - Upload Prescription") {
  const fieldsets = document.querySelectorAll("fieldset");
  const form = fieldsets[0].querySelector("form");
  const orderSelect = form.querySelector('select[name="order_id"]');
  const medSelect = form.querySelector('select[name="medicine"]');
  const doctorInput = form.querySelector('input[name="doctor_name"]');
  const dateInput = form.querySelector('input[name="issue_date"]');
  const submitBtn = form.querySelector('input[type="submit"]');
  const table = fieldsets[1].querySelector("table");

  let editRow = null;

  function resetEditMode() {
    editRow = null;
    submitBtn.value = "Upload prescription";
  }

  function setupRxRow(row) {
  
    row.querySelector('input[value="Edit"]').addEventListener("click", function () {
      editRow = row;
      orderSelect.value = row.cells[0].textContent.trim();
      medSelect.value = row.cells[1].textContent.trim();
      doctorInput.value = row.cells[2].textContent.trim();
      submitBtn.value = "Update prescription";
    });

   
    row.querySelector('input[value="Delete"]').addEventListener("click", function () {
      if (editRow === row) {
        form.reset();
        resetEditMode();
      }
      row.remove();
    });
  }

 
  const actionTh = document.createElement("th");
  actionTh.textContent = "Action";
  table.rows[0].appendChild(actionTh);

  
  for (let i = 1; i < table.rows.length; i++) {
    const actionTd = document.createElement("td");
    actionTd.innerHTML = '<input type="button" value="Edit"> <input type="button" class="danger" value="Delete">';
    table.rows[i].appendChild(actionTd);
    setupRxRow(table.rows[i]);
  }

  
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const order = orderSelect.value;
    const med = medSelect.value;
    const doctor = doctorInput.value.trim();
    const issueDate = dateInput.value;

    if (order === "Select an order" || med === "Select a medicine" || doctor === "") {
      alert("Please select order, medicine, and enter doctor's name.");
      return;
    }

    if (!document.getElementById("confirm").checked) {
      alert("Please confirm the prescription is genuine.");
      return;
    }

    if (editRow !== null) {
    
      editRow.cells[0].textContent = order;
      editRow.cells[1].textContent = med;
      editRow.cells[2].textContent = doctor;
      if (issueDate !== "") {
        editRow.cells[3].textContent = issueDate;
      }
      alert("Prescription updated!");
    } else {
      
      const tr = document.createElement("tr");
      tr.align = "center";
      tr.innerHTML =
        "<td>" + order + "</td>" +
        "<td>" + med + "</td>" +
        "<td>" + doctor + "</td>" +
        "<td>" + (issueDate !== "" ? issueDate : "Today") + "</td>" +
        '<td><span class="badge pending">Pending</span></td>' +
        '<td><input type="button" value="Edit"> <input type="button" class="danger" value="Delete"></td>';
      table.appendChild(tr);
      setupRxRow(tr);
      alert("Prescription uploaded!");
    }

    form.reset();
    resetEditMode();
  });

  // Clear button reset
  form.addEventListener("reset", resetEditMode);
}

// Reviews and Feedback
if (title === "MediShop - Reviews and Feedback") {
  document.querySelector('input[value="Submit review"]').addEventListener("click", function () {
    alert("Review submitted!");
  });

  document.querySelector('input[value="Send feedback"]').addEventListener("click", function () {
    alert("Feedback sent!");
  });
}

// Rate Our Store
if (title === "MediShop - Rate Our Store") {
  document.querySelector('input[value="Submit rating"]').addEventListener("click", function () {
    alert("Thank you for rating our store!");
  });
}

// My Profile
if (title === "MediShop - My Profile") {
  const profileForm = document.querySelector("form");
  const cancelBtn = document.querySelector('input[value="Cancel"]');

  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Profile updated!");
  });

  cancelBtn.addEventListener("click", function () {
    profileForm.reset();
  });
}