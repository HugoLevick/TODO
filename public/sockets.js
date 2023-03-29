const socket = io()
socket.on('nueva-tarea', tarea => printTask(tarea))
socket.on('actualizar-tarea', tarea => {
    const a = document.getElementById("t"+tarea.id); 
    console.log(a)
    printTask(tarea)
})