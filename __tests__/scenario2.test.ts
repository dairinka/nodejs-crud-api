import request from 'supertest';
import { server } from '../src/server';

const Header = {
  field: 'Accept',
  value: 'application/json',
};
const EndPoint = '/api/users';

const userData = JSON.stringify({
  username: 'Harry',
  age: 11,
  hobbies: ['quidditch'],
});
const updateUserData = JSON.stringify({ age: 22, hobbies: ['magic'] });
describe('2 scenario', () => {
  afterAll((done) => {
    server.close();
    done();
  });
  beforeAll(() => {
    server.close();
  });

  //Get all records with a GET api/users request when 2 users added
  test('get all records with emty db', async () => {
    await request(server)
      .post(EndPoint)
      .set(Header.field, Header.value)
      .send(userData);
    await request(server)
      .post(EndPoint)
      .set(Header.field, Header.value)
      .send(userData);
    const response = await request(server)
      .get(EndPoint)
      .set(Header.field, Header.value);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
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
    expect(response.body.username).toBe('Harry');
    expect(response.body.age).toBe(22);
    expect(response.body.hobbies).toEqual(['magic']);
  });

  /* get all users( expected 3) then delete one, check users array length(expected 2)
   */
  test(' get all users then delete one, check users array length', async () => {
    const allUserResponceStart = await request(server)
      .get(EndPoint)
      .set(Header.field, Header.value);

    expect(allUserResponceStart.body).toHaveLength(3);
    const id = allUserResponceStart.body[0].id;

    await request(server)
      .delete(`${EndPoint}/${id}`)
      .set(Header.field, Header.value);

    const allUserResponceEnd = await request(server)
      .get(EndPoint)
      .set(Header.field, Header.value);

    expect(allUserResponceEnd.body).toHaveLength(2);
  });
});
