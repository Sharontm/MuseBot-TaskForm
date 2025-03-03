document.getElementById('addTaskButton').addEventListener('click', function() {
  const tasksContainer = document.getElementById('tasksContainer');
  const lastTask = tasksContainer.lastElementChild;

  // Validate the last task before adding a new one
  const inputs = lastTask.querySelectorAll('input, textarea, select');
  for (let input of inputs) {
      if (!input.value) {
          alert('Please fill all fields in the current task before adding a new one.');
          return;
      }
  }

  const taskCount = tasksContainer.children.length + 1;
  const newTask = document.createElement('div');
  newTask.className = 'task';
  newTask.innerHTML = `
      <h3>Task ${taskCount}</h3>
      <label>Task Name:<input type="text" name="taskName" required></label>
      <label>Priority:
          <select name="priority" required>
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
          </select>
      </label>
      <label>Description:<textarea name="description" required></textarea></label>
      <label>Estimated Time:
          <input type="number" name="estimatedTime" min="1" required>
          <select name="timeUnit" required>
              <option value="">Select Unit</option>
              <option value="Minutes">Minutes</option>
              <option value="Hours">Hours</option>
          </select>
      </label>
  `;
  tasksContainer.appendChild(newTask);
});

document.getElementById('taskForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const tasks = [];
  document.querySelectorAll('.task').forEach(taskDiv => {
      const task = {
          name: taskDiv.querySelector('input[name="taskName"]').value,
          priority: taskDiv.querySelector('select[name="priority"]').value,
          description: taskDiv.querySelector('textarea[name="description"]').value,
          estimated_time: taskDiv.querySelector('input[name="estimatedTime"]').value + ' ' + taskDiv.querySelector('select[name="timeUnit"]').value
      };
      tasks.push(task);
  });

  fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks })
  })
  .then(res => res.json())
  .then(data => document.getElementById('response').textContent = data.status || data.error)
  .catch(err => document.getElementById('response').textContent = 'Error: ' + err.message);
});
