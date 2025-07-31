const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filters button');
const statusMessage = document.getElementById('status-message');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showStatus(msg, success = true) {
  statusMessage.textContent = msg;
  statusMessage.style.color = success ? '#28a745' : '#dc3545';
  setTimeout(() => { statusMessage.textContent = ''; }, 3000);
}

function renderTasks() {
  taskList.innerHTML = '';
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }
  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    // Span testo attività cliccabile per edit inline
    const spanText = document.createElement('span');
    spanText.className = 'task-text';
    spanText.textContent = task.text;
    spanText.title = 'Clicca per modificare';
    spanText.onclick = () => editTask(index);

    li.appendChild(spanText);

    // Bottone completamento
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.completed ? '🟢' : '⚪';
    toggleBtn.className = 'toggle-btn';
    toggleBtn.title = task.completed ? 'Segna come attiva' : 'Segna come completata';
    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      toggleTask(index);
    };
    li.appendChild(toggleBtn);

    // Bottone eliminazione
    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.className = 'delete-btn';
    delBtn.title = 'Elimina attività';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });
}

function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text === '') {
    showStatus('Inserisci un testo valido!', false);
    return;
  }
  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
  showStatus('Attività aggiunta con successo!');
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
  showStatus('Stato attività aggiornato.');
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  showStatus('Attività eliminata.');
}

function editTask(index) {
  const li = taskList.children[index];
  const spanText = li.querySelector('span.task-text');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = tasks[index].text;

  input.onkeydown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  input.onblur = saveEdit;

  function saveEdit() {
    const val = input.value.trim();
    if (val) {
      tasks[index].text = val;
      saveTasks();
      renderTasks();
      showStatus('Attività modificata.');
    } else {
      showStatus('Testo non valido, modifica annullata.', false);
      renderTasks();
    }
  }

  function cancelEdit() {
    renderTasks();
  }

  li.replaceChild(input, spanText);
  input.focus();
}

function setFilter(filter) {
  currentFilter = filter;
  filters.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
  renderTasks();
}

filters.forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

taskForm.addEventListener('submit', addTask);

renderTasks();