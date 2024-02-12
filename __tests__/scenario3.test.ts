import request from 'supertest';
import { server } from '../src/server';

const Header = {
  field: 'Accept',
  value: 'application/json',
};

describe('3 scenario', () => {
  afterAll((done) => {
    server.close();
    done();
  });
  beforeAll(() => {
    server.close();
  });

  // Check wrong casses
  test('get: handle wrong path "/tt", expect error 404', async () => {
    const responce = await request(server)
      .get('/tt')
      .set(Header.field, Header.value);
    expect(responce.statusCode).toBe(404);
  });
  test('get: handle wrong path /api/use, rexpect error 404', async () => {
    const responce = await request(server)
      .get('/api/user')
      .set(Header.field, Header.value);
    expect(responce.statusCode).toBe(404);
  });
  test('get: handle wrong path /api/users/22, expect error 400', async () => {
    const responce = await request(server)
      .get('/api/users/22')
      .set(Header.field, Header.value);
    expect(responce.statusCode).toBe(400);
  });

  test('post: body does not contain required fields, expect error 400', async () => {
    const responce = await request(server)
      .post('/api/users')
      .set(Header.field, Header.value)
      .send(JSON.stringify({ username: 'Ronald', age: 11 }));
    expect(responce.statusCode).toBe(400);
  });
  test('put: userId is invalid (not uuid), expect error 400', async () => {
    const responce = await request(server)
      .put('/api/users/25')
      .set(Header.field, Header.value)
      .send(JSON.stringify({ username: 'Ronald', age: 23 }));
    expect(responce.statusCode).toBe(400);
  });
  test("put: record with id === userId doesn't exist, expect error 404", async () => {
    const responce = await request(server)
      .put('/api/users/71f70057-4313-4fb0-a35d-167233b6a6cb')
      .set(Header.field, Header.value)
      .send(JSON.stringify({ username: 'Ronald', age: 23 }));
    expect(responce.statusCode).toBe(404);
  });
  test('delete: userId is invalid (not uuid), expect error 400', async () => {
    const responce = await request(server)
      .delete('/api/users/25')
      .set(Header.field, Header.value);
    expect(responce.statusCode).toBe(400);
  });
  test("delete: record with id === userId doesn't exist, expect error 404", async () => {
    const responce = await request(server)
      .delete('/api/users/71f70057-4313-4fb0-a35d-167233b6a6cb')
      .set(Header.field, Header.value);

    expect(responce.statusCode).toBe(404);
  });
});
