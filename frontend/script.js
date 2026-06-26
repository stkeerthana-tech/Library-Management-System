
const SAMPLE_BOOKS = [
  { id: "BK001", title: "The Pragmatic Programmer", author: "David Thomas", category: "Technology", copies: 4, available: 2, status: "Available" },
  { id: "BK002", title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", copies: 3, available: 0, status: "Issued" },
  { id: "BK003", title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", copies: 5, available: 5, status: "Available" },
  { id: "BK004", title: "Sapiens", author: "Yuval Noah Harari", category: "History", copies: 2, available: 1, status: "Available" },
  { id: "BK005", title: "Clean Code", author: "Robert C. Martin", category: "Technology", copies: 6, available: 0, status: "Issued" },
  { id: "BK006", title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", copies: 4, available: 3, status: "Available" },
  { id: "BK007", title: "Atomic Habits", author: "James Clear", category: "Self-Help", copies: 3, available: 1, status: "Available" },
  { id: "BK008", title: "Cosmos", author: "Carl Sagan", category: "Science", copies: 2, available: 0, status: "Issued" },
];

const SAMPLE_ISSUED_RECORDS = [
  { bookId: "BK002", userId: "U1023", issueDate: "2026-06-01", dueDate: "2026-06-15" },
  { bookId: "BK005", userId: "U1041", issueDate: "2026-06-05", dueDate: "2026-06-19" },
  { bookId: "BK008", userId: "U1007", issueDate: "2026-06-10", dueDate: "2026-06-24" },
];


function loadBooks() {
  const stored = localStorage.getItem("lms_books");
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fall through to sample data */ }
  }
  return JSON.parse(JSON.stringify(SAMPLE_BOOKS));
}

function saveBooks(books) {
  localStorage.setItem("lms_books", JSON.stringify(books));
}

function loadIssuedRecords() {
  const stored = localStorage.getItem("lms_issued");
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fall through */ }
  }
  return JSON.parse(JSON.stringify(SAMPLE_ISSUED_RECORDS));
}

function saveIssuedRecords(records) {
  localStorage.setItem("lms_issued", JSON.stringify(records));
}

/* ---------------------------------------------------------------
   2. MOBILE NAVIGATION (index.html / login.html navbar)
   --------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
    const isOpen = links.classList.contains("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

/* ---------------------------------------------------------------
   3. SIDEBAR (dashboard / books / issue / return shell pages)
   --------------------------------------------------------------- */
function initSidebar() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const sidebar = document.querySelector(".sidebar");
  const scrim = document.querySelector(".sidebar-scrim");
  if (!menuBtn || !sidebar || !scrim) return;

  function openSidebar() {
    sidebar.classList.add("open");
    scrim.classList.add("show");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
  }

  menuBtn.addEventListener("click", openSidebar);
  scrim.addEventListener("click", closeSidebar);
}

/* ---------------------------------------------------------------
   4. LOGIN PAGE — client-side validation
   --------------------------------------------------------------- */
function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const alertBox = document.getElementById("login-alert");

  function isValidEmail(value) {
    // Simple, readable email pattern — good enough for client-side checks
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function showError(input, errorEl, message) {
    input.classList.add("input-error");
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove("input-error");
    errorEl.textContent = "";
  }

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = "alert show " + (type === "success" ? "alert-success" : "alert-error");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value;

    if (emailVal === "") {
      showError(emailInput, emailError, "Email is required.");
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      showError(emailInput, emailError, "Enter a valid email address.");
      valid = false;
    } else {
      clearError(emailInput, emailError);
    }

    if (passwordVal === "") {
      showError(passwordInput, passwordError, "Password is required.");
      valid = false;
    } else if (passwordVal.length < 6) {
      showError(passwordInput, passwordError, "Password must be at least 6 characters.");
      valid = false;
    } else {
      clearError(passwordInput, passwordError);
    }

    if (!valid) {
      showAlert("Please fix the highlighted fields and try again.", "error");
      return;
    }

    // Demo-only authentication: any well-formed email/password combination
    // is accepted, since there is no backend. Redirect to the dashboard.
    showAlert("Login successful! Redirecting to dashboard...", "success");
    form.querySelector("button[type='submit']").disabled = true;
    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 800);
  });

  // Clear field errors as the user types
  emailInput.addEventListener("input", () => clearError(emailInput, emailError));
  passwordInput.addEventListener("input", () => clearError(passwordInput, passwordError));
}

/* ---------------------------------------------------------------
   5. DASHBOARD — statistics cards
   --------------------------------------------------------------- */
function initDashboardStats() {
  const totalEl = document.getElementById("stat-total-books");
  if (!totalEl) return; // not on dashboard

  const books = loadBooks();
  const issued = loadIssuedRecords();

  const totalCopies = books.reduce((sum, b) => sum + Number(b.copies), 0);
  const availableCopies = books.reduce((sum, b) => sum + Number(b.available), 0);
  const issuedCopies = totalCopies - availableCopies;
  const registeredUsers = 248; // sample static figure for this demo

  totalEl.textContent = totalCopies;
  document.getElementById("stat-available-books").textContent = availableCopies;
  document.getElementById("stat-registered-users").textContent = registeredUsers;
  document.getElementById("stat-issued-books").textContent = issuedCopies > 0 ? issuedCopies : issued.length;

  // Render a short "recently issued" list on the dashboard, if present
  const recentList = document.getElementById("recent-activity");
  if (recentList) {
    recentList.innerHTML = "";
    issued.slice(-4).reverse().forEach((record) => {
      const book = books.find((b) => b.id === record.bookId);
      const li = document.createElement("li");
      li.className = "info-list-row";
      li.textContent = (book ? book.title : record.bookId) + " — issued to " + record.userId + " on " + record.issueDate;
      recentList.appendChild(li);
    });
  }
}

/* ---------------------------------------------------------------
   6. BOOKS MANAGEMENT PAGE — render table, search, add book
   --------------------------------------------------------------- */
function renderBooksTable(books) {
  const tbody = document.getElementById("books-tbody");
  const emptyState = document.getElementById("books-empty-state");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (books.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  books.forEach((book) => {
    const tr = document.createElement("tr");

    const statusBadgeClass = book.available > 0 ? "badge-success" : "badge-danger";
    const statusLabel = book.available > 0 ? "Available" : "Issued";

    tr.innerHTML =
      "<td>" + book.id + "</td>" +
      "<td>" + book.title + "</td>" +
      "<td>" + book.author + "</td>" +
      "<td>" + book.category + "</td>" +
      "<td>" + book.copies + "</td>" +
      "<td>" + book.available + "</td>" +
      "<td><span class='badge " + statusBadgeClass + "'>" + statusLabel + "</span></td>" +
      "<td><div class='row-actions'>" +
        "<button class='icon-btn delete-book-btn' data-id='" + book.id + "' title='Delete book'>&#128465;</button>" +
      "</div></td>";

    tbody.appendChild(tr);
  });

  // Wire up delete buttons each time the table is rendered
  tbody.querySelectorAll(".delete-book-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      let books = loadBooks();
      books = books.filter((b) => b.id !== id);
      saveBooks(books);
      applyBooksFilter();
    });
  });
}

function applyBooksFilter() {
  const searchInput = document.getElementById("book-search");
  const categorySelect = document.getElementById("category-filter");
  if (!searchInput) return;

  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect ? categorySelect.value : "all";

  let books = loadBooks();

  if (category !== "all") {
    books = books.filter((b) => b.category === category);
  }

  if (query !== "") {
    books = books.filter((b) =>
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.id.toLowerCase().includes(query)
    );
  }

  renderBooksTable(books);
}

function initBooksPage() {
  const tbody = document.getElementById("books-tbody");
  if (!tbody) return; // not on books.html

  // Initial render
  applyBooksFilter();

  // Search-as-you-type
  const searchInput = document.getElementById("book-search");
  searchInput.addEventListener("input", applyBooksFilter);

  const categorySelect = document.getElementById("category-filter");
  if (categorySelect) categorySelect.addEventListener("change", applyBooksFilter);

  // Add Book modal open/close
  const modalOverlay = document.getElementById("add-book-modal");
  const openBtn = document.getElementById("open-add-book-btn");
  const closeBtn = document.getElementById("close-add-book-btn");
  const cancelBtn = document.getElementById("cancel-add-book-btn");

  function openModal() { modalOverlay.classList.add("show"); }
  function closeModal() {
    modalOverlay.classList.remove("show");
    document.getElementById("add-book-form").reset();
    clearAddBookErrors();
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Add Book form validation + submission
  const addBookForm = document.getElementById("add-book-form");
  addBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateAddBookForm()) return;

    const books = loadBooks();
    const newId = "BK" + String(books.length + 1).padStart(3, "0");

    const title = document.getElementById("new-book-title").value.trim();
    const author = document.getElementById("new-book-author").value.trim();
    const category = document.getElementById("new-book-category").value;
    const copies = parseInt(document.getElementById("new-book-copies").value, 10);

    books.push({
      id: newId,
      title: title,
      author: author,
      category: category,
      copies: copies,
      available: copies,
      status: "Available",
    });

    saveBooks(books);
    closeModal();
    applyBooksFilter();
  });
}

function clearAddBookErrors() {
  document.querySelectorAll("#add-book-form .field-error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll("#add-book-form input, #add-book-form select").forEach((el) =>
    el.classList.remove("input-error")
  );
}

function validateAddBookForm() {
  clearAddBookErrors();
  let valid = true;

  function fail(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("input-error");
    document.getElementById(errorId).textContent = message;
    valid = false;
  }

  const title = document.getElementById("new-book-title").value.trim();
  const author = document.getElementById("new-book-author").value.trim();
  const category = document.getElementById("new-book-category").value;
  const copies = document.getElementById("new-book-copies").value;

  if (title === "") fail("new-book-title", "new-book-title-error", "Title is required.");
  if (author === "") fail("new-book-author", "new-book-author-error", "Author is required.");
  if (category === "") fail("new-book-category", "new-book-category-error", "Choose a category.");
  if (copies === "" || parseInt(copies, 10) < 1) {
    fail("new-book-copies", "new-book-copies-error", "Enter at least 1 copy.");
  }

  return valid;
}

/* ---------------------------------------------------------------
   7. ISSUE BOOK PAGE
   --------------------------------------------------------------- */
function initIssueBookForm() {
  const form = document.getElementById("issue-book-form");
  if (!form) return;

  const bookIdInput = document.getElementById("issue-book-id");
  const lookupResult = document.getElementById("issue-lookup-result");

  // Default the issue date field to today for convenience
  const issueDateInput = document.getElementById("issue-date");
  if (issueDateInput && !issueDateInput.value) {
    issueDateInput.value = new Date().toISOString().split("T")[0];
  }

  // Live book lookup as the librarian types a Book ID
  bookIdInput.addEventListener("input", function () {
    const books = loadBooks();
    const book = books.find((b) => b.id.toLowerCase() === this.value.trim().toLowerCase());
    if (!book) {
      lookupResult.classList.remove("show");
      return;
    }
    lookupResult.innerHTML =
      "<strong>" + book.title + "</strong> by " + book.author +
      "<br>Available copies: " + book.available;
    lookupResult.classList.add("show");
  });

  function fail(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("input-error");
    document.getElementById(errorId).textContent = message;
  }

  function clearAll() {
    document.querySelectorAll("#issue-book-form .field-error").forEach((el) => (el.textContent = ""));
    document.querySelectorAll("#issue-book-form input").forEach((el) => el.classList.remove("input-error"));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAll();
    let valid = true;

    const userId = document.getElementById("issue-user-id").value.trim();
    const bookId = document.getElementById("issue-book-id").value.trim();
    const issueDate = document.getElementById("issue-date").value;

    if (userId === "") { fail("issue-user-id", "issue-user-id-error", "User ID is required."); valid = false; }
    if (bookId === "") { fail("issue-book-id", "issue-book-id-error", "Book ID is required."); valid = false; }
    if (issueDate === "") { fail("issue-date", "issue-date-error", "Issue date is required."); valid = false; }

    const books = loadBooks();
    const bookIndex = books.findIndex((b) => b.id.toLowerCase() === bookId.toLowerCase());

    if (valid && bookIndex === -1) {
      fail("issue-book-id", "issue-book-id-error", "No book found with this ID.");
      valid = false;
    } else if (valid && books[bookIndex].available < 1) {
      fail("issue-book-id", "issue-book-id-error", "No available copies to issue.");
      valid = false;
    }

    const alertBox = document.getElementById("issue-alert");

    if (!valid) {
      alertBox.textContent = "Please fix the highlighted fields and try again.";
      alertBox.className = "alert show alert-error";
      return;
    }

    // Decrement available copies and log the issued record
    books[bookIndex].available -= 1;
    saveBooks(books);

    const records = loadIssuedRecords();
    records.push({ bookId: books[bookIndex].id, userId: userId, issueDate: issueDate, dueDate: "" });
    saveIssuedRecords(records);

    alertBox.textContent = "Book \"" + books[bookIndex].title + "\" issued to user " + userId + " successfully.";
    alertBox.className = "alert show alert-success";
    form.reset();
    issueDateInput.value = new Date().toISOString().split("T")[0];
    lookupResult.classList.remove("show");
  });
}

/* ---------------------------------------------------------------
   8. RETURN BOOK PAGE
   --------------------------------------------------------------- */
function initReturnBookForm() {
  const form = document.getElementById("return-book-form");
  if (!form) return;

  const returnDateInput = document.getElementById("return-date");
  if (returnDateInput && !returnDateInput.value) {
    returnDateInput.value = new Date().toISOString().split("T")[0];
  }

  const bookIdInput = document.getElementById("return-book-id");
  const lookupResult = document.getElementById("return-lookup-result");

  bookIdInput.addEventListener("input", function () {
    const records = loadIssuedRecords();
    const record = records.find((r) => r.bookId.toLowerCase() === this.value.trim().toLowerCase());
    if (!record) {
      lookupResult.classList.remove("show");
      return;
    }
    const books = loadBooks();
    const book = books.find((b) => b.id === record.bookId);
    lookupResult.innerHTML =
      "<strong>" + (book ? book.title : record.bookId) + "</strong>" +
      "<br>Issued to: " + record.userId +
      "<br>Issue date: " + record.issueDate;
    lookupResult.classList.add("show");
  });

  function fail(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("input-error");
    document.getElementById(errorId).textContent = message;
  }

  function clearAll() {
    document.querySelectorAll("#return-book-form .field-error").forEach((el) => (el.textContent = ""));
    document.querySelectorAll("#return-book-form input").forEach((el) => el.classList.remove("input-error"));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAll();
    let valid = true;

    const bookId = document.getElementById("return-book-id").value.trim();
    const returnDate = document.getElementById("return-date").value;

    if (bookId === "") { fail("return-book-id", "return-book-id-error", "Book ID is required."); valid = false; }
    if (returnDate === "") { fail("return-date", "return-date-error", "Return date is required."); valid = false; }

    const records = loadIssuedRecords();
    const recordIndex = records.findIndex((r) => r.bookId.toLowerCase() === bookId.toLowerCase());

    if (valid && recordIndex === -1) {
      fail("return-book-id", "return-book-id-error", "No active issue record found for this Book ID.");
      valid = false;
    }

    const alertBox = document.getElementById("return-alert");

    if (!valid) {
      alertBox.textContent = "Please fix the highlighted fields and try again.";
      alertBox.className = "alert show alert-error";
      return;
    }

    // Remove the issue record and restore the book's available count
    const returnedRecord = records[recordIndex];
    records.splice(recordIndex, 1);
    saveIssuedRecords(records);

    const books = loadBooks();
    const bookIndex = books.findIndex((b) => b.id === returnedRecord.bookId);
    if (bookIndex !== -1) {
      books[bookIndex].available = Math.min(books[bookIndex].copies, books[bookIndex].available + 1);
      saveBooks(books);
    }

    alertBox.textContent = "Book \"" + (bookIndex !== -1 ? books[bookIndex].title : returnedRecord.bookId) + "\" returned successfully.";
    alertBox.className = "alert show alert-success";
    form.reset();
    returnDateInput.value = new Date().toISOString().split("T")[0];
    lookupResult.classList.remove("show");
  });
}


document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initSidebar();
  initLoginForm();
  initDashboardStats();
  initBooksPage();
  initIssueBookForm();
  initReturnBookForm();
});