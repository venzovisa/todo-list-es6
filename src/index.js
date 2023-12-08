const uuidv4 = require("uuid").v4;
const dayjs = require("dayjs");
const { createTodo } = require("./utils");
require("./index.css");
require("./favicon.ico");

const initTodos = () => {
  const todos = getTodos();

  if (todos && todos.length !== 0) {
    const todoListNode = document.querySelector(".todo-list");
    Array.from(JSON.parse(todos)).forEach((todo) => {
      todoListNode.appendChild(buildTodoNode(todo));
    });
  } else {
    document.querySelector(".message").innerHTML = "<p>Empty list</p>";
    return;
  }

  document.querySelector(".message").innerHTML = "";
};

const handleEdit = (todo) => {
  const todoNode = document.getElementById(todo.id);
  todoNode.querySelector(".content").remove();
  todoNode.querySelector(".buttons").remove();

  const form = document.createElement("form");
  form.enctype = "multipart/form-data";

  const titleInput = document.createElement("input");
  titleInput.maxLength = "100";
  titleInput.type = "text";
  titleInput.classList.add("title");
  titleInput.name = "title";
  titleInput.value = todo.title;
  titleInput.required = true;
  form.appendChild(titleInput);

  const descriptionInput = document.createElement("input");
  descriptionInput.maxLength = "100";
  descriptionInput.type = "text";
  descriptionInput.classList.add("description");
  descriptionInput.name = "description";
  descriptionInput.value = todo.description;
  descriptionInput.required = true;
  form.appendChild(descriptionInput);

  const deadlineInput = document.createElement("input");
  deadlineInput.type = "date";
  deadlineInput.classList.add("deadline");
  deadlineInput.name = "deadline";
  deadlineInput.value = todo.deadline;
  deadlineInput.required = true;
  form.appendChild(deadlineInput);

  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Save";
  form.addEventListener("submit", (e) => handleSave(e, todo));
  form.appendChild(submit);

  todoNode.insertBefore(form, todoNode.querySelector(".buttons"));
};

const handleSave = (e, todo) => {
  const todoNode = document.getElementById(todo.id);
  todoNode.querySelector("form").remove();
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  todoNode.appendChild(buildTodoContent(formProps));
  todoNode.appendChild(buildTodoButtons(todo));

  let todos = getTodos();

  if (todos) {
    todos = Array.from(JSON.parse(todos));

    todos.forEach((t) => {
      if (t.id === todo.id) {
        t.title = formProps.title;
        t.description = formProps.description;
        t.deadline = formProps.deadline;

        if (dayjs().isAfter(dayjs(formProps.deadline))) {
          todoNode.querySelector(".deadline").classList.add("expired");
          todoNode.querySelector(".completed").disabled = true;
        } else {
          todoNode.querySelector(".deadline").classList.remove("expired");
          todoNode.querySelector(".completed").disabled = false;
        }

        setTodos(todos);
      }
    });
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  const { title, description, deadline } = formProps;
  const todo = createTodo(uuidv4(), title, description, deadline);
  document.querySelector(".todo-list").appendChild(buildTodoNode(todo));

  const todos = getTodos();

  if (todos) {
    window.localStorage.setItem(
      "todos",
      JSON.stringify([...JSON.parse(todos), todo])
    );
  } else {
    window.localStorage.setItem("todos", JSON.stringify([todo]));
  }

  document.querySelector(".message").innerHTML = "";
};

const handleRemove = (todoId) => {
  document.getElementById(todoId)?.remove();
  let todos = getTodos();

  if (todos) {
    todos = Array.from(JSON.parse(todos));
    todos = todos.filter((t) => t.id !== todoId);
    setTodos(todos);
  }

  if (!todos || todos.length === 0) {
    document.querySelector(".message").innerHTML = "<p>Empty list</p>";
  }
};

const buildTodoNode = (todo) => {
  const todoNode = document.createElement("div");
  todoNode.classList.add("todo");
  todoNode.id = todo.id;
  todoNode.appendChild(buildTodoContent(todo));
  todoNode.appendChild(buildTodoButtons(todo));

  return todoNode;
};

const buildTodoContent = (todo) => {
  const contentNode = document.createElement("div");
  contentNode.classList.add("content");

  const titleNode = document.createElement("div");
  titleNode.classList.add("title");
  titleNode.textContent = todo.title;
  contentNode.appendChild(titleNode);

  const descriptionNode = document.createElement("div");
  descriptionNode.classList.add("description");
  descriptionNode.textContent = todo.description;
  contentNode.appendChild(descriptionNode);

  const deadlineNode = document.createElement("div");

  if (dayjs().isAfter(dayjs(todo.deadline))) {
    deadlineNode.classList.add("expired");
  }

  deadlineNode.classList.add("deadline");
  deadlineNode.textContent = todo.deadline;
  contentNode.appendChild(deadlineNode);

  return contentNode;
};

const buildTodoButtons = (todo) => {
  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const editNode = document.createElement("div");
  editNode.classList.add("edit");
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.disabled = todo.disabled;
  editBtn.addEventListener("click", () => handleEdit(todo));
  editNode.appendChild(editBtn);
  buttons.appendChild(editNode);

  const deleteNode = document.createElement("div");
  deleteNode.classList.add("delete");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.disabled = todo.disabled;
  deleteBtn.addEventListener("click", () => handleRemove(todo.id));
  deleteNode.appendChild(deleteBtn);
  buttons.appendChild(deleteNode);

  const completed = document.createElement("input");
  completed.type = "checkbox";
  completed.checked = todo.completed;
  completed.disabled = todo.disabled;
  completed.id = "completedCheckbox";
  completed.classList.add("completed");

  if (dayjs().isAfter(dayjs(todo.deadline))) {
    completed.disabled = true;
  }
  completed.addEventListener("click", () => {
    let todos = getTodos();

    if (todos) {
      todos = Array.from(JSON.parse(todos));
      todos.forEach((t) => {
        if (t.id === todo.id) {
          t.completed = !t.completed;
          setTodos(todos);
        }
      });

      if (todos.every((todo) => todo.completed)) {
        document.querySelector(".message").innerHTML =
          "<p>Todo list is completed</p>";
      } else {
        document.querySelector(".message").innerHTML = "";
      }
    }
  });
  buttons.appendChild(completed);
  const completedLabel = document.createElement("label");
  completedLabel.for = "completedCheckbox";
  completedLabel.textContent = "completed";
  buttons.appendChild(completedLabel);

  const disabled = document.createElement("input");
  disabled.type = "checkbox";
  disabled.checked = todo.disabled;
  disabled.disabled = todo.disabled;
  disabled.id = "disabledCheckbox";
  disabled.classList.add("disabled");
  disabled.addEventListener("click", () => {
    let todos = getTodos();

    if (todos) {
      todos = Array.from(JSON.parse(todos));
      todos.forEach((t) => {
        if (t.id === todo.id) {
          t.disabled = true;
          setTodos(todos);
          const todoNode = document.getElementById(todo.id);
          todoNode.querySelector(".edit button").disabled = true;
          todoNode.querySelector(".delete button").disabled = true;
          todoNode.querySelector(".completed").disabled = true;
          todoNode.querySelector(".disabled").disabled = true;
        }
      });
    }
  });

  buttons.appendChild(disabled);
  const disabledLabel = document.createElement("label");
  disabledLabel.for = "disabledCheckbox";
  disabledLabel.textContent = "disabled";
  buttons.appendChild(disabledLabel);

  return buttons;
};

const setTodos = (todos) =>
  window.localStorage.setItem("todos", JSON.stringify(todos));

const getTodos = () => window.localStorage.getItem("todos");

window.addEventListener("load", () => {
  initTodos();
  document
    .querySelector("#add-todo-form")
    .addEventListener("submit", handleSubmit);
});
