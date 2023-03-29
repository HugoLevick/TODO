const socket = io();
socket.on("nueva-tarea", (tarea) => printTask(tarea));
socket.on("actualizar-tarea", (tarea) => {
  document.getElementById("t" + tarea.id)?.remove();
  printTask(tarea);
});
socket.on("borrar-tarea", (tareaid) => document.getElementById("t" + tareaid)?.remove());
