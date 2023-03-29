const socket = io()
socket.on('nueva-tarea', tarea => printTask(tarea))
socket.on('actualizar-tarea', tarea => {document.getElementById(tarea.id)?.remove(); printTask(tarea)})