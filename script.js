const form = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');

document.getElementById('addTaskBtn').addEventListener('click', () => {
  const taskDiv = document.createElement('div');
  taskDiv.classList.add('task', 'mb-3');
  taskDiv.innerHTML = `<input type="text" name="task" placeholder="Enter task" class="w-full p-2 border rounded">`;
  tasksContainer.appendChild(taskDiv);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const tasks = Array.from(document.querySelectorAll('input[name="task"]'))
    .map(input => input.value)
    .filter(task => task.trim() !== "");

  const response = await fetch('https://YOUR_BACKEND_URL/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks }),
  });

  if (response.ok) {
    alert('Tasks sent to Discord!');
    form.reset();
  } else {
    alert('Failed to send tasks.');
  }
});
