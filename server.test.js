const app = require("./server");
const supertest = require("supertest");
const { expect } = require("@jest/globals");
const request = supertest(app);

test("gets the /antiqua test endpoint", async () => {
  const res = await request.get("/antiqua");
  expect(res.status).toBe(200);
});

test("gets the /vaccines query test endpoint", async () => {
  const res = await request.get("/vaccines?date=2021-01-02&vaccine=solar");
  expect(res.status).toBe(200);
});
