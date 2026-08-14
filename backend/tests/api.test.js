import test, { before, after, describe } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { MongoMemoryServer } from "mongodb-memory-server";

let mem;
let server;
let BASE;
let Student;

before(async () => {
  mem = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mem.getUri();
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET ||= "test-secret-that-is-at-least-32-characters-long";
  process.env.CLOUDINARY_CLOUD_NAME ||= "test";
  process.env.CLOUDINARY_API_KEY ||= "test";
  process.env.CLOUDINARY_API_SECRET ||= "test";
  process.env.OPENROUTER_API_KEY ||= "test";

  const { default: createApp } = await import("../src/app.js");
  ({ Student } = await import("../src/models/Student.model.js"));

  await mongoose.connect(process.env.MONGODB_URI);
  await Student.syncIndexes();

  server = createApp().listen(0);
  await new Promise((r) => server.once("listening", r));
  BASE = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  server?.close();
  await mongoose.disconnect();
  await mem?.stop();
});

const post = (path, body, token) =>
  fetch(BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

const get = (path, token) =>
  fetch(BASE + path, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

const seedUser = (email, password = "secret123") =>
  Student.create({
    PlayerName: "Test Player",
    email,
    password: bcrypt.hashSync(password, 4),
    PhoneNO: "9876543210",
    Avatar: { url: "https://cdn.test/a.png", public_id: "test/a" },
    playerXp: 10,
    Level: 1,
    streak: 1,
  });

const loginAs = async (email, password = "secret123") => {
  const res = await post("/auth/login", { email, password });
  const body = await res.json();
  return { token: body.token, id: body.user?._id, body, status: res.status };
};

describe("authentication", () => {
  test("rejects a wrong password", async () => {
    await seedUser("wrongpw@test.com");
    const res = await post("/auth/login", {
      email: "wrongpw@test.com",
      password: "not-the-password",
    });
    assert.equal(res.status, 401);
  });

  test("accepts the right password and is case-insensitive on email", async () => {
    await seedUser("casey@test.com");
    const { status, body } = await loginAs("CASEY@TEST.COM");

    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.equal(typeof body.token, "string");
    assert.ok(body.user._id);
  });

  test("never returns the password hash", async () => {
    await seedUser("nohash@test.com");
    const { body } = await loginAs("nohash@test.com");
    assert.ok(!JSON.stringify(body).includes("$2b$"));
  });

  test("a regex in the email field cannot match another account", async () => {
    await seedUser("regex@test.com");
    const res = await post("/auth/login", { email: ".*", password: "secret123" });
    assert.notEqual(res.status, 200);
  });

  test("rejects requests with no token", async () => {
    const res = await get("/auth/game/507f1f77bcf86cd799439011");
    assert.equal(res.status, 401);
  });

  test("rejects a forged token", async () => {
    const res = await get("/auth/game/507f1f77bcf86cd799439011", "not.a.real.token");
    assert.equal(res.status, 401);
  });

  test("enforces the unique email index", async () => {
    await seedUser("dupe@test.com");
    await assert.rejects(() => seedUser("dupe@test.com"), (err) => err.code === 11000);
  });
});

describe("player data", () => {
  test("returns the player without the password", async () => {
    await seedUser("player1@test.com");
    const { token, id } = await loginAs("player1@test.com");

    const res = await get(`/auth/game/${id}`, token);
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.ok(body.student);
    assert.ok(!("password" in body.student));
  });
});

describe("xp and levelling", () => {
  test("awards xp, levels up and rolls the remainder over", async () => {
    await seedUser("xp1@test.com");
    const { token, id } = await loginAs("xp1@test.com");

    const res = await post(
      "/auth/Xp",
      { studentId: id, playerXp: 100, topic: "introduction" },
      token
    );
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.level, 2);
    assert.equal(body.playerXp, 10);
    assert.equal(body.progress.introduction, 100);
    assert.equal(body.ecoLearn, 10);
  });

  test("accumulates each topic independently", async () => {
    await seedUser("xp2@test.com");
    const { token, id } = await loginAs("xp2@test.com");

    await post("/auth/Xp", { studentId: id, playerXp: 30, topic: "introduction" }, token);
    const res = await post(
      "/auth/Xp",
      { studentId: id, playerXp: 50, topic: "climate" },
      token
    );
    const body = await res.json();

    assert.equal(body.progress.introduction, 30);
    assert.equal(body.progress.climate, 50);
  });

  test("ignores a level supplied by the client", async () => {
    await seedUser("xp3@test.com");
    const { token, id } = await loginAs("xp3@test.com");

    const res = await post(
      "/auth/Xp",
      { studentId: id, playerXp: 10, topic: "climate", level: 999 },
      token
    );
    const body = await res.json();

    assert.equal(body.level, 1);
  });

  test("rejects an out-of-range xp award", async () => {
    await seedUser("xp4@test.com");
    const { token, id } = await loginAs("xp4@test.com");

    const res = await post(
      "/auth/Xp",
      { studentId: id, playerXp: 999999, topic: "climate" },
      token
    );
    assert.equal(res.status, 400);
  });

  test("rejects an unknown topic", async () => {
    await seedUser("xp5@test.com");
    const { token, id } = await loginAs("xp5@test.com");

    const res = await post(
      "/auth/Xp",
      { studentId: id, playerXp: 10, topic: "not-a-topic" },
      token
    );
    assert.equal(res.status, 400);
  });
});

describe("progress endpoints", () => {
  test("returns all eight topics", async () => {
    await seedUser("prog@test.com");
    const { token, id } = await loginAs("prog@test.com");
    await post("/auth/Xp", { studentId: id, playerXp: 40, topic: "introduction" }, token);

    const whole = await (await get(`/auth/wholedata/${id}`, token)).json();
    assert.equal(Object.keys(whole.progress).length, 8);
    assert.equal(whole.progress.introduction, 40);

    const intro = await (await get(`/auth/intro/${id}`, token)).json();
    assert.equal(intro.introduction, 40);

    const convo = await (await get(`/auth/convo/${id}`, token)).json();
    assert.equal(convo.conservation, 0);
  });
});

describe("quiz", () => {
  test("stores the score and returns the updated player", async () => {
    await seedUser("quiz@test.com");
    const { token, id } = await loginAs("quiz@test.com");

    const res = await post(`/auth/quize/${id}`, { playerXp: 40 }, token);
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.updatedStudent.Quize, 40);
    assert.ok(!JSON.stringify(body).includes("$2b$"));
  });
});

describe("account isolation", () => {
  test("cannot read another player's data", async () => {
    await seedUser("me1@test.com");
    const victim = await seedUser("victim1@test.com");
    const { token } = await loginAs("me1@test.com");

    const res = await get(`/auth/game/${victim._id}`, token);
    assert.equal(res.status, 403);
  });

  test("cannot award xp to another player", async () => {
    await seedUser("me2@test.com");
    const victim = await seedUser("victim2@test.com");
    const { token } = await loginAs("me2@test.com");

    const res = await post(
      "/auth/Xp",
      { studentId: String(victim._id), playerXp: 500, topic: "climate" },
      token
    );
    assert.equal(res.status, 403);

    const fresh = await Student.findById(victim._id);
    assert.equal(fresh.playerXp, 10);
  });

  test("cannot submit a quiz score for another player", async () => {
    await seedUser("me3@test.com");
    const victim = await seedUser("victim3@test.com");
    const { token } = await loginAs("me3@test.com");

    const res = await post(`/auth/quize/${victim._id}`, { playerXp: 100 }, token);
    assert.equal(res.status, 403);
  });
});

describe("request handling", () => {
  test("returns 404 for an unknown route", async () => {
    const res = await get("/does-not-exist");
    assert.equal(res.status, 404);
  });

  test("returns 400 for malformed json", async () => {
    const res = await fetch(BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not json",
    });
    assert.equal(res.status, 400);
  });

  test("blocks an origin that is not allow-listed", async () => {
    const res = await get("/health");
    assert.equal(res.headers.get("x-powered-by"), null);

    const blocked = await fetch(BASE + "/health", {
      headers: { Origin: "https://evil.example.com" },
    });
    assert.equal(blocked.headers.get("access-control-allow-origin"), null);
  });

  test("reports health", async () => {
    const body = await (await get("/health")).json();
    assert.equal(body.status, "ok");
    assert.equal(body.database, "connected");
  });
});
