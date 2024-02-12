import request from 'supertest';
import { server } from '../src/server';

const Header = {
  field: 'Accept',
  value: 'application/json',
};
const EndPoint = '/api/users';
const userData = JSON.stringify({
  username: 'Hermione',
  age: 11,
  hobbies: ['books'],
});
const updateUserData = JSON.stringify({ age: 25 });
describe('1 scenario', () => {
  afterAll((done) => {
    server.close();
    done();
  });
  beforeAll(() => {
    server.close();
  });
  //Get all records with a GET api/users request (an empty array is expected)
  test('get all records with emty db', async () => {
    const response = await request(server)
      .get(EndPoint)
      .set(Header.field, Header.value);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
  /*  A new object is created by a POST api/users request 
    (a response containing newly created record is expected)
   */
  test('add user', async () => {
    const response = await request(server)
      .post(EndPoint)
      .set(Header.field, Header.value)
      .send(userData);
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toBe('Hermione');
    expect(response.body.age).toBe(11);
    expect(response.body.hobbies).toEqual(['books']);
  });
  /* With a GET api/user/{userId} request, we try to get the created 
   record by its id (the created record is expected)
   */
  test('get user', async () => {
    const id = (
      await request(server)
        .post(EndPoint)
        .set(Header.field, Header.value)
        .send(userData)
    ).body['id'];
    const response = await request(server)
      .get(`${EndPoint}/${id}`)
      .set(Header.field, Header.value);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.username).toBe('Hermione');
    expect(response.body.age).toBe(11);
    expect(response.body.hobbies).toEqual(['books']);
  });
  /* Try to update the created record with a PUT api/users/{userId}request 
   (a response is expected containing an updated object with the same id)
  */
  test('update user data', async () => {
    const id = (
      await request(server)
        .post(EndPoint)
        .set(Header.field, Header.value)
        .send(userData)
    ).body['id'];
    const response = await request(server)
      .put(`${EndPoint}/${id}`)
      .set(Header.field, Header.value)
      .send(updateUserData);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.username).toBe('Hermione');
    expect(response.body.age).toBe(25);
    expect(response.body.hobbies).toEqual(['books']);
  });

  /* With a DELETE api/users/{userId} request, we delete the created 
   object by id (confirmation of successful deletion is expected)
 */
  test('delete user', async () => {
    const id = (
      await request(server)
        .post(EndPoint)
        .set(Header.field, Header.value)
        .send(userData)
    ).body['id'];
    const response = await request(server)
      .delete(`${EndPoint}/${id}`)
      .set(Header.field, Header.value);

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');
  });
  /* With a GET api/users/{userId} request, we are trying to get 
   a deleted object by id (expected answer is that there is no such object)
*/
  test('get deleted user', async () => {
    const id = (
      await request(server)
        .post(EndPoint)
        .set(Header.field, Header.value)
        .send(userData)
    ).body['id'];
    await request(server)
      .delete(`${EndPoint}/${id}`)
      .set(Header.field, Header.value);

    const response = await request(server)
      .get(`${EndPoint}/${id}`)
      .set(Header.field, Header.value);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBe('Error: no entry with this ID exists');
  });
});
