import uuid from 'uuid';
import { IUserDb, IServerResponse } from 'types';

class UserDb {
  db: Map<string, IUserDb>;
  constructor() {
    this.db = new Map();
  }

  __returnServerAnswer(
    statusCode: 200 | 204 | 400 | 404,
    usersData?: IUserDb[],
  ): IServerResponse {
    const serverStatus = {
      200: '',
      204: 'File was successfully deleted',
      400: 'The request body does not contain required fields',
      404: "Record with this id doesn't exist",
    };
    return {
      status: {
        statusCode,
        statusMessage: serverStatus[statusCode],
      },
      users: usersData,
    };
  }

  __validationUserId(userId: string): IServerResponse | null {
    if (!uuid.validate(userId)) return this.__returnServerAnswer(400);
    if (!this.db.has(userId)) return this.__returnServerAnswer(404);
    return null;
  }

  getAllUsers() {
    const users = Array.from(this.db.values());
    return this.__returnServerAnswer(200, users);
  }

  getUserById(userId: string): IServerResponse {
    const getValidationUserId = this.__validationUserId(userId);
    if (getValidationUserId) return getValidationUserId;

    const userInfo = this.db.get(userId) as IUserDb;

    return this.__returnServerAnswer(200, [userInfo]);
  }

  addUser({ username, age, hobbies }: IUserDb): IServerResponse {
    if (!username || !age || !hobbies) {
      return this.__returnServerAnswer(400);
    }

    const userInfo: IUserDb = {
      id: uuid.v4(),
      username,
      age,
      hobbies,
    };

    this.db.set(String(userInfo.id), userInfo);

    return this.__returnServerAnswer(200, [userInfo]);
  }

  updateUserData(userId: string, userData: Partial<IUserDb>) {
    const getValidationUserId = this.__validationUserId(userId);
    if (getValidationUserId) return getValidationUserId;

    const previousUserInfo = this.db.get(userId) as IUserDb;
    const updateUserData = Object.assign(previousUserInfo, userData);
    this.db.set(userId, updateUserData);

    return this.__returnServerAnswer(200, [updateUserData]);
  }

  deleteUserById(userId: string) {
    const getValidationUserId = this.__validationUserId(userId);
    if (getValidationUserId) return getValidationUserId;

    this.db.delete(userId);

    return this.__returnServerAnswer(204);
  }
}
export const currentUserDb = new UserDb();
