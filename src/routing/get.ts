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
  const urlParts = url?.split('/');
  if (
    !url ||
    !url.startsWith('/api/users') ||
    (urlParts && urlParts[2] !== 'users')
  ) {
    errorResponse(res, 404, 'There is no such endpoint');
    return;
  }

  let serverResponse: IServerResponse;

  if (urlParts && urlParts.length > 4) {
    errorResponse(res, 404, 'There is no such endpoint');
    return;
  }

  try {
    const userId = urlParts && urlParts[3];
    if (urlParts?.length === 4 && userId) {
      serverResponse = db.getUserById(userId);
    } else {
      serverResponse = db.getAllUsers();
    }
    const { status, users } = serverResponse;
    res.statusCode = status.code;

    if (status.code === 200) {
      res.end(
        JSON.stringify((users && users.length === 1 && users[0]) || users),
      );
      return;
    }
    res.end(JSON.stringify(status.message));
  } catch (err) {
    console.log(err);
  }
};
