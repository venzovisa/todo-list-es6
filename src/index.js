import { v4 as uuidv4 } from 'uuid';
import "./index.css";
import "./favicon.ico";

class Todo {
    id;
    title;
    description;
    deadline;
    disabled;
    completed;

    constructor(title, description, deadline) {
        if (!title || !description || !deadline) {
            throw Error("Missing param");
        }

        this.id = uuidv4();
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.disabled = false;
        this.completed = false;
    };
}

class List {
    todos = [];
    addTodo(todo){
        this.todos.push(todo);
    }
    removeTodo(todo){
        this.todos = this.todos.filter(t => t.id !== todo.id);
    }
}


const initTodos = () => {
    const todos = window.localStorage.getItem("todos");

    if (todos) {
        const todoListNode = document.querySelector(".todo-list");
        Array.from(JSON.parse(todos, null, 2)).forEach(todo => {
            todoListNode.appendChild(buildTodoNode(todo));
        });
    }
} 

window.addEventListener("load", () => {
    initTodos();
});


const todoForm = (title, description, deadline) => {
    const form = document.createElement("form");
    form.classList.add("edit-todo-form");
    const titleInput = document.createElement("input");
    titleInput.textContent = title;
    const descriptionInput = document.createElement("input");
    descriptionInput.textContent = description;
    const deadlineInput = document.createElement("input");
    deadlineInput.textContent = deadline;
    const submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.value = "Save";

    form.appendChild(titleInput);
    form.appendChild(descriptionInput);
    form.appendChild(deadlineInput);
    form.appendChild(submit);

    return form;
}

const handleEdit = (todo) => {
  const todoNode = document.getElementById(todo.id);
  todoNode.querySelector(".content").remove();

  const form = document.createElement("form");
  form.enctype = "multipart/form-data";

  const titleInput = document.createElement("input");
  titleInput.maxLength = "100";
  titleInput.type = "text";
  titleInput.classList.add("title");
  titleInput.name = "title";
  titleInput.value = todo.title;
  form.appendChild(titleInput);

  const descriptionInput = document.createElement("input");
  descriptionInput.maxLength = "100";
  descriptionInput.type = "text";
  descriptionInput.classList.add("description");
  descriptionInput.name = "description";
  descriptionInput.value = todo.description;
  form.appendChild(descriptionInput);

  const deadlineInput = document.createElement("input");
  deadlineInput.maxLength = "100";
  deadlineInput.type = "text";
  deadlineInput.classList.add("deadline");
  deadlineInput.name = "deadline";
  deadlineInput.value = todo.deadline;
  form.appendChild(titleInput);

  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Save";
  submit.addEventListener("click", (e) => handleSave(e, todo))
  form.appendChild(submit);

  todo.insertBefore(form, todo.querySelector(".buttons"));
}

const handleSave = (e, todo) => {
  const todoNode = document.getElementById(todo.id);
  todoNode.querySelector("form").remove();
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  const { title, description, deadline } = formProps; 
  const newTodo = new Todo(title, description, deadline);
  todoNode.insertBefore(buildTodoNode(newTodo), todoNode.querySelector(".buttons"));

  const todos = window.localStorage.getItem("todos");

  if (todos) {
      const matchTodo = todos.find(t => t.id === todo.id);
      if (matchTodo) {
        matchTodo.title = todo.title;
        matchTodo.description = todo.description;
        matchTodo.deadline = todo.deadline;
        window.localStorage.setItem("todos", JSON.stringify(todos));
      }
  } 

  console.log("handleSave", window.localStorage.getItem("todos"));
}

const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    const { title, description, deadline } = formProps; 
    const todo = new Todo(title, description, deadline);
    document.querySelector(".todo-list").appendChild(buildTodoNode(todo));

    const todos = window.localStorage.getItem("todos");

    if (todos) {
        window.localStorage.setItem("todos", JSON.stringify([...JSON.parse(todos), todo]));
    } else {
        window.localStorage.setItem("todos", JSON.stringify([todo]));
    }

    console.log("handleSubmit", window.localStorage.getItem("todos"));
}

const buildTodoNode = (todo) => {
    const todoNode = document.createElement("div");
    todoNode.classList.add("todo");
    todoNode.id = todo.id;

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
    deadlineNode.classList.add("deadline");
    deadlineNode.textContent = todo.deadline;
    contentNode.appendChild(deadlineNode);

    todoNode.appendChild(contentNode);

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const editNode = document.createElement("div");
    editNode.classList.add("edit");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => handleEdit(todo))
    editNode.appendChild(editBtn);
    buttons.appendChild(editNode);

    const deleteNode = document.createElement("div");
    deleteNode.classList.add("delete");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => handleRemove(todo.id))
    deleteNode.appendChild(deleteBtn);
    buttons.appendChild(deleteNode);

    todoNode.appendChild(buttons);

    return todoNode;
}

const handleRemove = (todoId) => {
    document.getElementById(todoId)?.remove();
}

document.querySelector("#add-todo-form").addEventListener("submit", handleSubmit);