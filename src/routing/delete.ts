import { UserDb } from 'database/UserDb';
import { errorResponse } from '../error/errorResponse';
import { IncomingMessage, ServerResponse } from 'http';
import { IServerResponse } from 'types';

export const del = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  db: UserDb,
) => {
  const url = req.url;
  const urlParts = url?.split('/');

  if (
    !url ||
    !url.startsWith('/api/users') ||
    (urlParts && urlParts[2] !== 'users') ||
    req.url === '/api/users'
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
    if (urlParts && urlParts[3]) {
      const userId = urlParts[3];
      serverResponse = db.deleteUserById(userId);
      const { status } = serverResponse;
      res.statusCode = status.code;
      if (status.code === 204) res.statusMessage = status.message;
      res.end(JSON.stringify(status.message));
    }
  } catch (err) {
    console.log(err);
  }
};
