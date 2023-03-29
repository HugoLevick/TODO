const socket = io()
socket.on('nueva-tarea', tarea => printTask(tarea))
socket.on('actualizar-tarea', tarea => doneTask(tarea))