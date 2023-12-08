const createTodo = (id, title, description, deadline) => {
  if (!id || !title || !description || !deadline) {
    throw Error("Missing param");
  }

  return {
    id,
    title,
    description,
    deadline,
    disabled: false,
    completed: false,
  };
};

exports.createTodo = createTodo;
