const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const errorMessage = document.getElementById("error-message");

// Add new task
function addTask() {
  const inputValue = inputBox.value.trim();

  if (inputValue === "") {
    showError("⚠️ Please enter a task before adding.");
    return;
  }

  const li = document.createElement("li");
  li.textContent = inputBox.value;
  listContainer.appendChild(li);

  const span = document.createElement("span");
  span.innerHTML = "\u00d7"; // × character
  li.appendChild(span);

  inputBox.value = "";
  hideError();
  saveData();
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

// Hide error message
function hideError() {
  errorMessage.style.display = "none";
}

// Also hide error when typing
inputBox.addEventListener("input", () => {
  if (inputBox.value.trim() !== "") {
    hideError();
  }
});

// Add task on Enter key press
inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Clear all tasks
function clearAllTasks() {
  listContainer.innerHTML = "";
  saveData();
}

// Clear only completed tasks
function clearCompletedTasks() {
  const tasks = listContainer.querySelectorAll("li.checked");
  tasks.forEach((task) => task.remove());
  saveData();
}

// Toggle check or delete task
listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
  }
});

// Save tasks to local storage
function saveData() {
  localStorage.setItem("tasks", listContainer.innerHTML);
}

// Load tasks on page load
function showTasks() {
  listContainer.innerHTML = localStorage.getItem("tasks") || "";
}

showTasks();
