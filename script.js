const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const prioritySelect = document.getElementById("todo-priority");
const list = document.getElementById("todo-list");

let sortMode = "priority-date"; // ⭐️ ← ここ最初に！

// ローカルストレージから読み込み
let todos = JSON.parse(localStorage.getItem("todos")) || [];
renderTodos();

// イベント：フォーム送信
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = input.value.trim();
  const date = dateInput.value;
  const priority = prioritySelect.value;

  if (text === "") return;

  const todo = {
    id: Date.now(),
    text,
    date,
    priority,
    completed: false
  };

  todos.push(todo);
  saveTodos();
  renderTodos();

  // フォームリセット
  input.value = "";
  dateInput.value = "";
  prioritySelect.value = "中";
});

// 保存
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 表示
function renderTodos() {
    list.innerHTML = "";
  
    const priorityOrder = { 高: 1, 中: 2, 低: 3 };
  
    const sortedTodos = [...todos].sort((a, b) => {
      // ① 完了フラグ（未完了が上）
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
  
      // ② ソート条件切り替え
      let result = 0;
  
      if (sortMode === "priority-date") {
        result = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (result === 0) {
          const dateA = a.date ? new Date(a.date) : new Date("9999-12-31");
          const dateB = b.date ? new Date(b.date) : new Date("9999-12-31");
          result = dateA - dateB;
        }
      } else if (sortMode === "date-priority") {
        const dateA = a.date ? new Date(a.date) : new Date("9999-12-31");
        const dateB = b.date ? new Date(b.date) : new Date("9999-12-31");
        result = dateA - dateB;
        if (result === 0) {
          result = priorityOrder[a.priority] - priorityOrder[b.priority];
        }
      } else if (sortMode === "reverse") {
        result = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (result === 0) {
          const dateA = a.date ? new Date(a.date) : new Date("9999-12-31");
          const dateB = b.date ? new Date(b.date) : new Date("9999-12-31");
          result = dateB - dateA;
        }
      } else {
        // 🔒 fallback（例外防止）
        result = 0;
      }
  
      return result;
    });
  
    // 👇 表示
    sortedTodos.forEach(todo => {
      const li = document.createElement("li");
      li.classList.add(`priority-${todo.priority}`);
      if (todo.completed) li.classList.add("completed");
  
      li.innerHTML = `
        <div>
          <strong>${todo.text}</strong>
          <div class="meta">
            ${todo.date ? `📅 ${todo.date}　` : ""}
            優先度：${todo.priority}
          </div>
        </div>
        <div class="actions">
          <button onclick="toggleComplete(${todo.id})">✔️</button>
          <button class="delete" onclick="deleteTodo(${todo.id})">🗑 削除</button>
        </div>
      `;
  
      list.appendChild(li);
    });
  }
    
  

// 完了切替
function toggleComplete(id) {
  todos = todos.map(todo => {
    if (todo.id === id) todo.completed = !todo.completed;
    return todo;
  });
  saveTodos();
  renderTodos();
}

// 削除
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

sortMode = "priority-date"; // デフォルトの並び順

function setSortMode(mode) {
  sortMode = mode;
  renderTodos();
}

