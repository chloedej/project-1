// ========================================
// 1. TASK DATA
// ========================================

// All tasks live in an array of objects.
// Each object represents one task.

const tasks = [
    {
        id: 1,
        title: "Size Chart",
        description: "Media planning balances the strategic planning process. The questionnaire is more relevant than ever.",
        category: "Work",
        completed: false
    },
    {
        id: 2,
        title: "Garden Plants",
        description: "Plan the garden and decide which plants to buy this weekend.",
        category: "Personal",
        completed: false
    },
    {
        id: 3,
        title: "Send a mail to PM",
        description: "Marketing activity determines the media business. Follow up with the project manager.",
        category: "Work",
        completed: false
    },
    {
        id: 4,
        title: "Buy Harry Potter Book",
        description: "Find the next book to add to the collection.",
        category: "Personal",
        completed: false
    },
    {
        id: 5,
        title: "Meet at the airport",
        description: "Remember to arrive on time for the meeting.",
        category: "Family",
        completed: false
    }
];


// ========================================
// 2. GET HTML ELEMENTS
// ========================================

// These variables let JavaScript access our HTML.

const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskCategory = document.getElementById("taskCategory");
const taskError = document.getElementById("taskError");
const taskSummary = document.getElementById("taskSummary");
const emptyMessage = document.getElementById("emptyMessage");

const addButton = document.getElementById("addButton");
const cancelButton = document.getElementById("cancelButton");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");


// ========================================
// 3. CURRENT FILTER
// ========================================

// "all" means show every task initially.

let currentFilter = "all";


// ========================================
// 4. RENDER TASKS
// ========================================

// This function draws the task cards on the page.
// It uses the data inside the tasks array.

function renderTasks() {

    // Start by clearing the old cards.
    taskList.innerHTML = "";

    // Get the text typed into the search box.
    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    // FILTER: decide which tasks should be displayed.
    const filteredTasks = tasks.filter(function(task) {

        // Check whether the task matches the status filter.
        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        // Check whether the task matches the search.
        const matchesSearch =
            task.title.toLowerCase().includes(searchText) ||
            task.description.toLowerCase().includes(searchText);

        // The task must match both conditions.
        return matchesFilter && matchesSearch;
    });

    // SORT: change the order if the user selects an option.
    if (sortSelect.value === "title") {
        filteredTasks.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });
    }

    // Create a card for every matching task.
    filteredTasks.forEach(function(task) {

        // Create the main card.
        const card = document.createElement("article");
        card.classList.add("task-card");

        // Store the task's ID on the card.
        card.dataset.id = task.id;

        // Visually mark completed tasks.
        if (task.completed) {
            card.classList.add("completed");
        }

        // Create the title.
        const title = document.createElement("h2");
        title.textContent = task.title;

        // Create the description.
        const description = document.createElement("p");
        description.textContent = task.description;

        // Create the category label.
        const category = document.createElement("div");
        category.classList.add("task-meta");
        category.textContent = "Category: " + task.category;

        // Create the button container.
        const actions = document.createElement("div");
        actions.classList.add("task-actions");

        // Create the complete button.
        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.classList.add("complete-btn");
        completeButton.dataset.action = "complete";

        completeButton.textContent = task.completed
            ? "Undo Complete"
            : "Mark Complete";

        // Create the delete button.
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";
        deleteButton.textContent = "Delete";

        // Put the buttons inside their container.
        actions.append(completeButton, deleteButton);

        // Put everything inside the card.
        card.append(title, description, category, actions);

        // Add the card to the webpage.
        taskList.appendChild(card);
    });

    // Show a message if no cards match.
    emptyMessage.hidden = filteredTasks.length !== 0;

    // Update the task summary.
    updateSummary();
}


// ========================================
// 5. COMPUTED TASK SUMMARY USING REDUCE
// ========================================

function updateSummary() {

    // REDUCE: count the tasks that are not complete.
    const tasksLeft = tasks.reduce(function(total, task) {

        if (!task.completed) {
            return total + 1;
        }

        return total;

    }, 0);

    // Count the completed tasks too.
    const completedCount = tasks.reduce(function(total, task) {
        return total + (task.completed ? 1 : 0);
    }, 0);

    // Display the results.
    taskSummary.textContent =
        tasksLeft + " tasks left • " +
        completedCount + " completed • " +
        tasks.length + " total";
}


// ========================================
// 6. OPEN AND CLOSE THE ADD-TASK FORM
// ========================================

addButton.addEventListener("click", function() {

    // Show or hide the form.
    taskForm.hidden = !taskForm.hidden;

    // Clear any old error message.
    taskError.textContent = "";

    // Focus the title field when opening.
    if (!taskForm.hidden) {
        taskTitle.focus();
    }
});

cancelButton.addEventListener("click", function() {

    taskForm.hidden = true;

    taskForm.reset();

    taskError.textContent = "";
});


// ========================================
// 7. ADD A TASK WITH VALIDATION
// ========================================

taskForm.addEventListener("submit", function(event) {

    // Stop the browser from refreshing the page.
    event.preventDefault();

    // Get the user's input and remove extra spaces.
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const category = taskCategory.value;

    // Do not allow an empty title.
    if (title === "") {

        taskError.textContent =
            "Please enter a task title before adding a task.";

        taskTitle.focus();

        return;
    }

    // Generate a new ID.
    const newId = tasks.length > 0
        ? Math.max(...tasks.map(function(task) {
            return task.id;
        })) + 1
        : 1;

    // Create the new task object.
    const newTask = {
        id: newId,
        title: title,
        description: description || "No description provided.",
        category: category,
        completed: false
    };

    // Store the new object in the array.
    tasks.push(newTask);

    // Clear the form and error message.
    taskForm.reset();
    taskError.textContent = "";

    // Close the form.
    taskForm.hidden = true;

    // Switch to All so the new task is visible.
    currentFilter = "all";

    document.querySelectorAll(".filter-btn").forEach(function(button) {
        button.classList.toggle(
            "selected",
            button.dataset.filter === "all"
        );
    });

    // Draw the updated list.
    renderTasks();
});


// ========================================
// 8. EVENT DELEGATION: COMPLETE OR DELETE
// ========================================

// One event listener handles all task buttons.
// We do not need a separate listener for every card.

taskList.addEventListener("click", function(event) {

    // Find the button that was clicked.
    const button = event.target.closest("button[data-action]");

    // Stop if the click was not on a task button.
    if (!button || !taskList.contains(button)) {
        return;
    }

    // Find the card containing the button.
    const card = button.closest(".task-card");

    if (!card) {
        return;
    }

    // Read the task ID stored on the card.
    const taskId = Number(card.dataset.id);

    // Find the matching task object in the array.
    const task = tasks.find(function(item) {
        return item.id === taskId;
    });

    if (!task) {
        return;
    }

    // COMPLETE: toggle the task's completion status.
    if (button.dataset.action === "complete") {

        task.completed = !task.completed;

        // Use classList.toggle to change the visual style.
        card.classList.toggle("completed", task.completed);

        // Redraw to update the button and current filter.
        renderTasks();
    }

    // DELETE: remove the task from the array.
    if (button.dataset.action === "delete") {

        const taskIndex = tasks.findIndex(function(item) {
            return item.id === taskId;
        });

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
        }

        // Redraw the list without the deleted task.
        renderTasks();
    }
});


// ========================================
// 9. FILTER: ALL, ACTIVE, COMPLETED
// ========================================

document.querySelectorAll(".filter-btn").forEach(function(button) {

    button.addEventListener("click", function() {

        // Save the selected filter.
        currentFilter = button.dataset.filter;

        // Highlight the selected filter button.
        document.querySelectorAll(".filter-btn").forEach(function(btn) {
            btn.classList.toggle("selected", btn === button);
        });

        // Display the matching tasks.
        renderTasks();
    });
});


// ========================================
// 10. SEARCH TASKS
// ========================================

searchInput.addEventListener("input", function() {

    // Refresh the list as the user types.
    renderTasks();
});


// ========================================
// 11. SORT TASKS
// ========================================

sortSelect.addEventListener("change", function() {

    renderTasks();
});


// ========================================
// 12. INITIAL PAGE RENDER
// ========================================

// Run the function when JavaScript loads.

renderTasks();