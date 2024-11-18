// Load tugas dari localStorage saat halaman dimuat
document.addEventListener("DOMContentLoaded", muatTugas);

function tambahTugas() {
  const mataPelajaran = document.getElementById('mataPelajaran').value.trim();
  const taskInput = document.getElementById('taskInput').value.trim();
  const tanggalPengumpulan = document.getElementById('tanggalPengumpulan').value;
  if (!mataPelajaran || !taskInput || !tanggalPengumpulan) {
    alert('Silakan lengkapi semua kolom!');
    return;
  }

  const tugasBaru = {
    id: Date.now(), // ID unik untuk tiap tugas
    mataPelajaran,
    taskInput,
    tanggalPengumpulan,
    status: 'belum'
  };

  const taskList = getTasks();
  taskList.push(tugasBaru);
  saveTasks(taskList);
  renderTasks(taskList);
  clearInputFields();
}

function clearInputFields() {
  document.getElementById('mataPelajaran').value = '';
  document.getElementById('taskInput').value = '';
  document.getElementById('tanggalPengumpulan').value = '';
}

function tandaiStatus(id, status) {
  const taskList = getTasks();
  const taskIndex = taskList.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    taskList[taskIndex].status = status;
    saveTasks(taskList);
    renderTasks(taskList);
  }
}

function hapusTugas(id) {
  const taskList = getTasks();
  const updatedTaskList = taskList.filter(task => task.id !== id);
  saveTasks(updatedTaskList);
  renderTasks(updatedTaskList);
}

function renderTasks(taskList) {
  const taskListElement = document.getElementById('taskList');
  taskListElement.innerHTML = '';

  // Urutkan berdasarkan tanggal pengumpulan dan status
  taskList.sort((a, b) => {
    if (a.status === 'selesai' && b.status !== 'selesai') return 1;
    if (a.status !== 'selesai' && b.status === 'selesai') return -1;
    return new Date(a.tanggalPengumpulan) - new Date(b.tanggalPengumpulan);
  });

  taskList.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.status}`;
    li.innerHTML = `
      <div>
        <strong>Mata Pelajaran:</strong> ${task.mataPelajaran}<br>
        <strong>Tugas:</strong> ${task.taskInput}<br>
        <strong>Pengumpulan:</strong> ${task.tanggalPengumpulan}
      </div>
      <div class="task-buttons">
        <button class="btn-belum" onclick="tandaiStatus(${task.id}, 'belum')">Belum</button>
        <button class="btn-proses" onclick="tandaiStatus(${task.id}, 'proses')">Proses</button>
        <button class="btn-selesai" onclick="tandaiStatus(${task.id}, 'selesai')">Selesai</button>
        <button class="btn-hapus" onclick="hapusTugas(${task.id})">Hapus</button>
      </div>
    `;
    taskListElement.appendChild(li);
  });
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(taskList) {
  localStorage.setItem('tasks', JSON.stringify(taskList));
}

function muatTugas() {
  const taskList = getTasks();
  renderTasks(taskList);
}