// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "to-do-app-ae837.firebaseapp.com",
  databaseURL: "https://to-do-app-ae837-default-rtdb.firebaseio.com/",
  projectId: "to-do-app-ae837",
  storageBucket: "to-do-app-ae837.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref("tasks");

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const errorMessage = document.getElementById("error-message");

// Add Task
function addTask() {
  const inputValue = inputBox.value.trim();

  if (inputValue === "") {
    showError("⚠️ Please enter a task before adding.");
    return;
  }

  if (navigator.onLine) {
    const taskRef = dbRef.push();
    taskRef.set({ text: inputValue });
  } else {
    const localTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    localTasks.push({ text: inputValue });
    localStorage.setItem("tasks", JSON.stringify(localTasks));
    renderTasksFromLocal(); // update UI
  }

  inputBox.value = "";
  hideError();
}

// Show Error
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}
function hideError() {
  errorMessage.style.display = "none";
}
inputBox.addEventListener("input", () => {
  if (inputBox.value.trim() !== "") {
    hideError();
  }
});

// Add on Enter Key
inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Render from Firebase (Real-time)
function renderTasksFromFirebase() {
  dbRef.on("value", function (snapshot) {
    listContainer.innerHTML = "";
    snapshot.forEach(function (child) {
      const task = child.val().text;
      const key = child.key;

      const li = document.createElement("li");
      li.textContent = task;
      li.setAttribute("data-key", key);

      const span = document.createElement("span");
      span.innerHTML = "\u00d7";
      li.appendChild(span);

      listContainer.appendChild(li);
    });
  });
}

// Render from LocalStorage
function renderTasksFromLocal() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  listContainer.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    li.setAttribute("data-local-index", index);

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);
  });
}

// Clear All Tasks
function clearAllTasks() {
  if (navigator.onLine) {
    dbRef.remove();
  } else {
    localStorage.removeItem("tasks");
    renderTasksFromLocal();
  }
}

// Clear Completed Tasks
function clearCompletedTasks() {
  const tasks = listContainer.querySelectorAll("li.checked");

  tasks.forEach((li) => {
    const key = li.getAttribute("data-key");
    const localIndex = li.getAttribute("data-local-index");

    if (navigator.onLine && key) {
      dbRef.child(key).remove();
    } else if (localIndex !== null) {
      const localTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      localTasks.splice(localIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(localTasks));
    }

    li.remove();
  });
}

// Click Events for Delete / Check
listContainer.addEventListener("click", function (e) {
  const li = e.target.tagName === "SPAN" ? e.target.parentElement : e.target;
  const key = li.getAttribute("data-key");
  const localIndex = li.getAttribute("data-local-index");

  if (e.target.tagName === "LI") {
    li.classList.toggle("checked");
  } else if (e.target.tagName === "SPAN") {
    if (navigator.onLine && key) {
      dbRef.child(key).remove();
    } else if (localIndex !== null) {
      const localTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      localTasks.splice(localIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(localTasks));
    }

    li.remove();
  }
});

// On Page Load
if (navigator.onLine) {
  renderTasksFromFirebase();
} else {
  renderTasksFromLocal();
}
