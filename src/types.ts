export interface IUserDb {
  id?: string;
  username: string;
  age: number;
  hobbies: string[] | [];
}

export interface IServerResponse {
  status: {
    code: number;
    message: string;
  };
  users?: IUserDb[];
}
