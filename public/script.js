function invalidTask() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Enter a valid task!",
  });
}

function success() {
  Swal.fire("Good job!", "The task was added!", "success");
}

const taskList = document.getElementById("taskList"); // get the list element
const taskInput = document.getElementById("taskInput"); // get the input element
const addButton = document.querySelector("form button"); // get the submit button
const deleteButton = document.getElementById("markAsDoneButton"); // get the 'Mark as done' button

async function addTask() {
  // function to add a new task to the list
  const title = taskInput.value.trim();
  if (title === "") {
    // looking for an empty value
    invalidTask();
  }

  try {
    await fetch("/api/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    success();
  } catch (error) {
    invalidTask();
    return;
  }

  // // create a new task
  // const newTask = document.createElement("li");
  // const newTaskLabel = document.createElement("label");
  // const newTaskCheckbox = document.createElement("input");
  // newTaskCheckbox.type = "checkbox"; // set the input type to checkbox
  // newTaskLabel.appendChild(newTaskCheckbox);
  // newTaskLabel.appendChild(document.createTextNode(taskInput.value));
  // newTask.appendChild(newTaskLabel);
  // taskList.appendChild(newTask); // Add the new task to the list
  // taskInput.value = ""; // Clear the input field
}

const doneTasksList = document.getElementById("doneTasksList");

// function to mark as done tasks
function doneTasks() {
  const checkboxes = taskList.querySelectorAll('input[type="checkbox"]'); // Get all the checkboxes in the list
  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      // check if the checkbox is checked
      const listItem = checkbox.parentNode; // get the list item that contains the checkbox
      const doneTask = document.createElement("li");
      console.log(listItem);
      doneTask.appendChild(listItem);
      doneTasksList.appendChild(doneTask);

      checkbox.checked = false; // uncheck the selected task when is done
      //listItem.parentNode.removeChild(listItem); // remove the list item from the list
    }
  });
  // Remove empty list items
  const listItems = taskList.querySelectorAll("li");
  listItems.forEach(function (listItem) {
    if (!listItem.hasChildNodes()) {
      listItem.parentNode.removeChild(listItem);
    }
  });
}

// fucntion to delete done tasks
function doneTasks() {
  const checkboxes = taskList.querySelectorAll('input[type="checkbox"]'); // Get all the checkboxes in the list
  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      // check if the checkbox is checked
      const listItem = checkbox.parentNode; // get the list item that contains the checkbox
      const doneTask = document.createElement("li");
      console.log(listItem);
      doneTask.appendChild(listItem);
      doneTasksList.appendChild(doneTask);

      checkbox.checked = false; // uncheck the selected task when is done
      //listItem.parentNode.removeChild(listItem); // remove the list item from the list
    }
  });
  // Remove empty list items
  const listItems = taskList.querySelectorAll("li");
  listItems.forEach(function (listItem) {
    if (!listItem.hasChildNodes()) {
      listItem.parentNode.removeChild(listItem);
    }
  });
}

function deleteTasks() {
  const listItems = doneTasksList.querySelectorAll("li");
  console.log(listItems);
  listItems.forEach(function (listItem) {
    if (!listItem.hasChildNodes()) {
      listItem.parentNode.removeChild(listItem);
    }
  });
}

// Add event listeners to the buttons
addButton?.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  addTask();
});

deleteButton.addEventListener("click", function (event) {
  event.preventDefault();
  deleteTasks();
});

markAsDoneButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  doneTasks();
});
