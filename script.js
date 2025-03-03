let taskCount = 0;

function createTaskElement() {
  taskCount++;
  return `
    <div class="task" id="task${taskCount}">
      <label>Task Name: <span class="required">*</span></label>
      <input type="text" name="name" placeholder="Enter the Task Name" required>

      <label>Priority: <span class="required">*</span></label>
      <select name="priority" required>
        <option value="">Select Priority</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <label>Description: <span class="required">*</span></label>
      <textarea name="description" placeholder="Enter a detailed description of the task to be performed" required></textarea>

      <label>Estimated Time: <span class="required">*</span></label>
      <div style="display: flex; gap: 10px;">
        <input type="number" name="time_value" placeholder="Enter time" min="1" required>
        <select name="time_unit" required>
          <option value="">Select Unit</option>
          <option>Minutes</option>
          <option>Hours</option>
        </select>
      </div>
    </div>
  `;
}

function addTask() {
  const container = document.getElementById('tasksContainer');
  container.insertAdjacentHTML('beforeend', createTaskElement());
}

function validateTasks() {
  const tasks = document.querySelectorAll('.task');
  const errors = [];

  tasks.forEach((task, index) => {
    const taskNum = index + 1;
    const name = task.querySelector('input[name="name"]').value.trim();
    const priority = task.querySelector('select[name="priority"]').value;
    const description = task.querySelector('textarea[name="description"]').value.trim();
    const timeValue = task.querySelector('input[name="time_value"]').value;
    const timeUnit = task.querySelector('select[name="time_unit"]').value;

    if (!name || !priority || !description || !timeValue || !timeUnit) {
      errors.push(`Please complete all fields in Task ${taskNum}.`);
    }
  });

  return errors;
}

document.getElementById('addTaskBtn').addEventListener('click', addTask);

document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  document.getElementById('errorMessages').innerHTML = '';

  const errors = validateTasks();
  if (errors.length) {
    document.getElementById('errorMessages').innerHTML = errors.join('<br>');
    return;
  }

  const tasks = Array.from(document.querySelectorAll('.task')).map(task => ({
    name: task.querySelector('input[name="name"]').value,
    priority: task.querySelector('select[name="priority"]').value,
    description: task.querySelector('textarea[name="description"]').value,
    estimated_time: {
      value: task.querySelector('input[name="time_value"]').value,
      unit: task.querySelector('select[name="time_unit"]').value
    }
  }));

  try {
    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks }),
    });

    if (response.ok) {
      alert('Tasks submitted successfully!');
    } else {
      alert('Failed to submit tasks.');
    }
  } catch (error) {
    alert('Error submitting tasks.');
  }
});

window.onload = addTask;
