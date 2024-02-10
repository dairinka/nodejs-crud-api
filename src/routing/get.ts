import { UserDb } from 'database/UserDb';
import { errorResponse } from '../error/errorResponse';
import { IncomingMessage, ServerResponse } from 'http';
import { IServerResponse } from 'types';

export const get = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  db: UserDb,
) => {
  const url = req.url;
  if (!url || !url.startsWith('/api/users')) {
    errorResponse(res, 404, 'There is no such endpoint');
  }
  const userId = url?.split('/');

  let serverResponse: IServerResponse;

  if (userId && userId.length > 4)
    errorResponse(res, 404, 'There is no such endpoint');

  try {
    if (userId?.length === 4 && userId[3]) {
      serverResponse = db.getUserById(userId[3]);
    } else {
      serverResponse = db.getAllUsers();
    }
    const { status, users } = serverResponse;
    res.statusCode = status.code;

    if (status.code === 200) {
      res.end(
        JSON.stringify((users && users.length === 1 && users[0]) || users),
      );
    }
    res.end(status.message);
  } catch (err) {
    console.log(err);
  }
};
