function invalidTask() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Enter a valid task!",
  });
}

const taskList = document.getElementById("taskList"); // get the list element
const taskInput = document.getElementById("taskInput"); // get the input element
const addButton = document.querySelector("form button"); // get the submit button
const deleteButton = document.getElementById("deleteButton"); // get the 'Mark as done' button

function addTask() {
  // function to add a new task to the list
  if (taskInput.value) {
    // if the input field isn't empty
    // looking for a duplicate value
    const tasks = taskList.getElementsByTagName("li"); // get all the list elements
    for (let i = 0; i < tasks.length; i++) {
      // loop on it to see if there is a repeated value
      const task = tasks[i].getElementsByTagName("label")[0].textContent; // store temporarily the actual list value
      if (task === taskInput.value) {
        invalidTask(); // show alert
        return;
      }
    }
    // create a new task
    const newTask = document.createElement("li");
    const newTaskLabel = document.createElement("label");
    const newTaskCheckbox = document.createElement("input");
    newTaskCheckbox.type = "checkbox"; // set the input type to checkbox
    newTaskLabel.appendChild(newTaskCheckbox);
    newTaskLabel.appendChild(document.createTextNode(taskInput.value));
    newTask.appendChild(newTaskLabel);
    taskList.appendChild(newTask); // Add the new task to the list
    taskInput.value = ""; // Clear the input field
  } else {
    invalidTask(); // Show an alert if the input field is empty
  }
}

const doneTasksList = document.getElementById("doneTasksList")

// function to mark as done tasks
function doneTasks() {
  const checkboxes = taskList.querySelectorAll('input[type="checkbox"]'); // Get all the checkboxes in the list
  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      // check if the checkbox is checked
        const listItem = checkbox.parentNode; // get the list item that contains the checkbox
        const doneTask = document.createElement("li");
        console.log(listItem)
        doneTask.appendChild(listItem)
        doneTasksList.appendChild(doneTask)

        checkbox.checked = false // uncheck the selected task when is done
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
          console.log(listItem)
          doneTask.appendChild(listItem)
          doneTasksList.appendChild(doneTask)
  
          checkbox.checked = false // uncheck the selected task when is done
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



// Add event listeners to the buttons
addButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  addTask();
});

deleteButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  doneTasks();
});
