const tasksContainer = document.getElementById('tasksContainer');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskForm = document.getElementById('taskForm');

function createTaskForm() {
  const taskDiv = document.createElement('div');
  taskDiv.classList.add('task');

  taskDiv.innerHTML = `
    <label>Task Name <span class="required">*</span></label>
    <input type="text" name="name" required>

    <label>Priority <span class="required">*</span></label>
    <select name="priority" required>
      <option value="">Select Priority</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>

    <label>Description <span class="required">*</span></label>
    <textarea name="description" required></textarea>

    <label>Estimated Time <span class="required">*</span></label>
    <div style="display: flex; gap: 10px;">
      <input type="number" name="estimated_time_value" placeholder="Enter number" required min="1">
      <select name="estimated_time_unit" required>
        <option value="">Select Unit</option>
        <option value="Minutes">Minutes</option>
        <option value="Hours">Hours</option>
      </select>
    </div>
  `;
  tasksContainer.appendChild(taskDiv);
}

addTaskBtn.addEventListener('click', createTaskForm);

// Add the first task form by default
createTaskForm();

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const tasks = [];
  let errors = [];

  document.querySelectorAll('.task').forEach((taskDiv, index) => {
    const name = taskDiv.querySelector('input[name="name"]').value.trim();
    const priority = taskDiv.querySelector('select[name="priority"]').value;
    const description = taskDiv.querySelector('textarea[name="description"]').value.trim();
    const estimatedTimeValue = taskDiv.querySelector('input[name="estimated_time_value"]').value.trim();
    const estimatedTimeUnit = taskDiv.querySelector('select[name="estimated_time_unit"]').value;

    const missingFields = [];
    if (!name) missingFields.push('Task Name');
    if (!priority) missingFields.push('Priority');
    if (!description) missingFields.push('Description');
    if (!estimatedTimeValue) missingFields.push('Estimated Time Value');
    if (!estimatedTimeUnit) missingFields.push('Estimated Time Unit');

    if (missingFields.length) {
      errors.push(`Task ${index + 1}: Missing ${missingFields.join(', ')}`);
    } else {
      tasks.push({
        name,
        priority,
        description,
        estimated_time: `${estimatedTimeValue} ${estimatedTimeUnit}`
      });
    }
  });

  if (errors.length) {
    alert(`Please fix the following errors:\n\n${errors.join('\n')}`);
    return;
  }

  const response = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks })
  });

  if (response.ok) {
    alert('Tasks submitted successfully!');
    taskForm.reset();
    tasksContainer.innerHTML = '';
    createTaskForm();
  } else {
    alert('Failed to submit tasks.');
  }
});
