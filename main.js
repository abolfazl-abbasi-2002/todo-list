const todoCon = document.querySelector(".todo-list");
const todoMessage = document.querySelector(".todo-mes");
const mainInput = document.querySelector(".main-input");
const addBtn = document.querySelector(".add-btn");
const STORAGE_KEY = "fa_todo";

// ALL TODODS TO SHOW
const todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// functions

// create item
function renderItems() {
  // clear input
  mainInput.value = "";
  // clear countainer
  todoCon.innerHTML = "";

  if (todos.length === 0) {
    todoMessage.classList.add("show");
    todoMessage.textContent = "Todo List is empty!";
    return;
  }
  // loop items array
  todos.forEach((item, index) => {
    // creat items
    // item
    const todoItem = document.createElement("div");
    todoItem.classList = `todo-item ${item.done ? "active" : ""}`;
    // title
    const title = document.createElement("p");
    title.classList = "item-title";
    title.textContent = item.text;
    // check
    const checkBtn = document.createElement("button");
    checkBtn.classList = "button check";
    const checkIcon = document.createElement("i");
    checkIcon.classList = "far fa-check-circle";
    checkBtn.appendChild(checkIcon);
    // edit
    const editBtn = document.createElement("button");
    editBtn.classList = "button";
    const editIcon = document.createElement("i");
    editIcon.classList = "far fa-edit";
    editBtn.appendChild(editIcon);
    // delete
    const deleteBtn = document.createElement("button");
    deleteBtn.classList = "button";
    const deleteIcon = document.createElement("i");
    deleteIcon.classList = "far fa-trash-alt";
    deleteBtn.appendChild(deleteIcon);

    // append-childs
    todoItem.appendChild(title);
    todoItem.appendChild(checkBtn);
    todoItem.appendChild(editBtn);
    todoItem.appendChild(deleteBtn);
    todoCon.appendChild(todoItem);

    ///// events
    // check
    checkBtn.addEventListener("click", () => {
      item.done = !item.done;
      renderItems();
      saveTasks();
    });

    // delete
    deleteBtn.addEventListener("click", () => {
      if (!confirm("Are you sure you want to delete this item?")) return;
      todos.splice(index, 1);
      renderItems();
      saveTasks();
    });

    // edit
    editBtn.addEventListener("click", () => {
      editItem(item, title);
    });
  });
}

// add item to list
function addItem() {
  const value = mainInput.value.trim();
  // Value to create element
  if (value !== "") {
    todos.push({ text: value, done: false });
    renderItems();
    saveTasks();
    todoMessage.classList.remove("show");
  } else {
    showMessage();
  }
}

// edit item
function editItem(item, textEl) {
  // creat inputs
  const input = document.createElement("input");
  input.classList = "edit-input";
  input.value = item.text;

  // change elements
  textEl.replaceWith(input);
  input.focus();

  function finish(save) {
    if (save) {
      const newText = input.value.trim();
      if (newText.length === 0) {
        showMessage();
        input.focus();
        return;
      }
      item.text = newText;
    }
    todoMessage.classList.remove("show");
    input.replaceWith(textEl);
    textEl.textContent = item.text;
    saveTasks();
    renderItems();
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true);
    if (e.key === "Escape") finish(false);
  });

  input.addEventListener("blur", () => finish(true));
}

// show message
function showMessage() {
  todoMessage.classList.add("show");
  todoMessage.textContent = "Please write something!";
  todoMessage.classList.add("animate");
  todoMessage.addEventListener("animationend", () => {
    todoMessage.classList.remove("animate");
  });
}

addBtn.addEventListener("click", () => {
  addItem();
});

mainInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});

renderItems();
