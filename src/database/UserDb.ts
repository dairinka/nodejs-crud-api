import { v4 as uuidv4, validate } from 'uuid';
import { IUserDb, IServerResponse } from 'types';

export class UserDb {
  db: Map<string, IUserDb>;
  constructor() {
    this.db = new Map();
  }

  // __returnServerAnswer(
  //   statusCode: 200 | 201 | 204 | 400 | 404,
  //   newMessage?: string,
  //   usersData?: IUserDb[],
  // ): IServerResponse {
  //   const serverStatus = {
  //     200: '',
  //     201: '',
  //     204: { success: 'File was successfully deleted' },
  //     400: {
  //       error:
  //         newMessage || 'the request body does not contain required fields',
  //     },
  //     404: { error: 'no entry with this ID exists' },
  //   };
  //   return {
  //     status: {
  //       code: statusCode,
  //       message: JSON.stringify(serverStatus[statusCode]),
  //     },
  //     users: usersData,
  //   };
  // }

  __returnServerAnswer(
    statusCode: 200 | 201 | 204 | 400 | 404,
    newMessage?: string,
    usersData?: IUserDb[],
  ): IServerResponse {
    const serverStatus = {
      200: '',
      201: '',
      204: 'File was successfully deleted',
      400: `Error: ${newMessage || 'the request body does not contain required fields'}`,

      404: 'Error: no entry with this ID exists',
    };
    return {
      status: {
        code: statusCode,
        message: serverStatus[statusCode],
      },
      users: usersData,
    };
  }

  __validationUserId(userId: string): IServerResponse | null {
    if (!validate(userId))
      return this.__returnServerAnswer(400, 'userId is invalid (not uuid)');
    if (!this.db.has(userId)) return this.__returnServerAnswer(404);
    return null;
  }

  getAllUsers() {
    const users = Array.from(this.db.values());
    console.log('users', users);
    return this.__returnServerAnswer(200, '', users);
  }

  getUserById(userId: string): IServerResponse {
    const getValidationUserId = this.__validationUserId(userId);
    if (getValidationUserId) return getValidationUserId;

    const userInfo = this.db.get(userId) as IUserDb;

    return this.__returnServerAnswer(200, '', [userInfo]);
  }

  addUser({ username, age, hobbies }: IUserDb): IServerResponse {
    console.log('username', username, 'age', age, 'hobbies', hobbies);
    if (!username || !age || !hobbies) {
      return this.__returnServerAnswer(400);
    }

    if (
      typeof username !== 'string' ||
      typeof age !== 'number' ||
      !Array.isArray(hobbies)
    )
      return this.__returnServerAnswer(
        400,
        'Some fields are of the wrong type',
      );

    const userId = uuidv4();
    const userInfo: IUserDb = {
      id: userId,
      username,
      age,
      hobbies,
    };
    console.log('userInfo', userInfo);
    this.db.set(userId, userInfo);

    return this.__returnServerAnswer(201, '', [userInfo]);
  }

  updateUserData(userId: string, userData: Partial<IUserDb>) {
    const getValidationUserId = this.__validationUserId(userId);
    if (getValidationUserId) return getValidationUserId;

    const previousUserInfo = this.db.get(userId) as IUserDb;
    const updateUserData = Object.assign(previousUserInfo, userData);
    this.db.set(userId, updateUserData);

    return this.__returnServerAnswer(200, '', [updateUserData]);
  }

  deleteUserById(userId: string) {
    const getValidationUserId = this.__validationUserId(userId);
    if (getValidationUserId) return getValidationUserId;

    this.db.delete(userId);

    return this.__returnServerAnswer(204);
  }
}
export const currentUserDb = new UserDb();
