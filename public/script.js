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

async function showTasks() {
  const allTasks = await fetch("/api/tareas").then(response => response.json())
  for (const task of allTasks) {
    printTask(task)
  }
  console.log(allTasks)
}

const taskList = document.getElementById("taskList"); // get the list element
const taskInput = document.getElementById("taskInput"); // get the input element
const addButton = document.querySelector("form button"); // get the submit button
const deleteButton = document.getElementById("markAsDoneButton"); // get the 'Mark as done' button
const doneTasksList = document.getElementById("doneTasksList"); 

showTasks()

async function addTask() {
  // function to add a new task to the list
  const title = taskInput.value.trim();
  if (title === "") {
    // looking for an empty value
    invalidTask();
  }

  
  const response = await fetch("/api/tareas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({title})
  })
  if (response.ok) {
    success();
  }else {
    invalidTask()
  }
}


function printTask(tarea) {
  const newTask = document.createElement("li");
  newTask.id = "t"+tarea.id
  const newTaskLabel = document.createElement("label");
  const newTaskCheckbox = document.createElement("input");
  newTaskCheckbox.type = "checkbox"; // set the input type to checkbox
  newTaskLabel.appendChild(newTaskCheckbox);
  newTaskLabel.appendChild(document.createTextNode(tarea.title));
  newTask.appendChild(newTaskLabel);
  if (tarea.status === "TODO"){
    taskList.appendChild(newTask); // Add the new task to the list
  }else {
    const doneTasksList = document.getElementById("doneTasksList");
    doneTasksList.appendChild(newTask);
  }
  taskInput.value = ""; // Clear the input field
}

async function doneTask() {
  const checkboxes = taskList.querySelectorAll('input[type="checkbox"]'); // Get all the checkboxes in the list
  checkboxes.forEach(async function (checkbox) {
    if (checkbox.checked) {
      const taskHTML = checkbox.parentElement.parentElement;
      const id = taskHTML.id.replace("t", "")
      const response = await fetch("/api/tareas/"+id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      })
      if (response.ok) {
        success();
      }else {
        alert('no se pudo')
      }
    }
    }
)}

async function deleteTask() {
  const checkboxes = doneTasksList.querySelectorAll('input[type="checkbox"]'); // Get all the checkboxes in the list
  checkboxes.forEach(async function (checkbox) {
    if (checkbox.checked) {
      const taskHTML = checkbox.parentElement.parentElement;
      const id = taskHTML.id.replace("t", "")
      const response = await fetch("/api/tareas/"+id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      if (response.ok) {
        success();
      }else {
        alert('no se pudo')
      }
    }
    }
)}






  // const id = 
  // for (const task of allTasks) {
  //   const response = await fetch("/api/tareas/"+id, {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" }
  //   })
  //   if (response.ok) {
  //     success();
  //   }else {
  //     invalidTask()
  //   }
  // }
  



function deleteTasks() {
  const listItems = doneTasksList.querySelectorAll("li");
  console.log(listItems);
  listItems.forEach(function (listItem) {
    if (!listItem.hasChildNodes()) {
      listItem.parentNode.removeChild(listItem);
    }
  });
}







































// // Add event listeners to the buttons
// addButton.addEventListener("click", function (event) {
//   event.preventDefault(); // Prevent the default form submission behavior
//   addTask();
// });

// deleteButton.addEventListener("click", function (event) {
//   event.preventDefault();
//   deleteTasks();
// });

// markAsDoneButton.addEventListener("click", function (event) {
//   event.preventDefault(); // Prevent the default form submission behavior
//   doneTasks();
// });







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