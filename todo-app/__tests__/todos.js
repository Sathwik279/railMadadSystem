const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
var cheerio = require("cheerio");

let server, agent;
//the server will be our express js application
//the agent wiil be used to send the http request
function extract//csrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_//csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let //csrfToken = extract//csrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _//csrf: //csrfToken,
  });
};

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const //csrfToken = extract//csrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "User A",
      email: "user.a@test.com",
      password: "12345678",
      _//csrf: //csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("create a new todo", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    const res = await agent.get("/todos"); //step1
    const //csrfToken = extract//csrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _//csrf: //csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Mark a todo as complete", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos"); //step1
    let //csrfToken = extract//csrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _//csrf: //csrfToken,
    });
    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/todos");
    //csrfToken = extract//csrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _//csrf: //csrfToken,
        completed: "updateCompleted",
      });
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Mark a todo as incomplete", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos"); //step1
    let //csrfToken = extract//csrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _//csrf: //csrfToken,
    });
    let groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    let parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    let dueTodayCount = parsedGroupedResponse.dueToday.length;
    let latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/todos");
    //csrfToken = extract//csrfToken(res);

    let markCompleteResponse = await agent.put(`/todos/${latestTodo.id}`).send({
      _//csrf: //csrfToken,
      completed: "updateCompleted",
    });
    let parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);

    groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    let completedCount = parsedGroupedResponse.completed.length;
    latestTodo = parsedGroupedResponse.completed[completedCount - 1];

    res = await agent.get("/todos");
    //csrfToken = extract//csrfToken(res);

    markCompleteResponse = await agent.put(`/todos/${latestTodo.id}`).send({
      _//csrf: //csrfToken,
      completed: "updateCompleted",
    });
    parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(false);
  });

  test("delete a todo", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos"); //step1
    let //csrfToken = extract//csrfToken(res);
    const response = await agent.post("/todos").send({
      title: "buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _//csrf: //csrfToken,
    });
    expect(response.statusCode).toBe(302);
    // const parsedResponse = JSON.parse(response.text);
    // const todoID = parsedResponse.id;

    // const deleteResponse = await agent.delete(`/todos/${todoID}`);
    // expect(deleteResponse.success).toBe("true");
  });
});
