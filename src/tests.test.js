const { createTodo } = require("./utils");

describe("todos", () => {
    it("should create todo object from params", () => {
        const expectedTodo = {
            id: "1",
            title: "Todo1",
            description: "description1",
            deadline: "2023-12-19",
            disabled: false,
            completed: false
        };

        expect(createTodo(expectedTodo.id, expectedTodo.title, expectedTodo.description, expectedTodo.deadline)).toEqual(expectedTodo);
    })
})