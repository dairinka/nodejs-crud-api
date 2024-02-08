export interface IUserDb {
  id?: string;
  username: string;
  age: number;
  hobbies: string[] | [];
}

export interface IServerResponse {
  status: {
    statusCode: number;
    statusMessage: string;
  };
  users?: IUserDb[];
}
