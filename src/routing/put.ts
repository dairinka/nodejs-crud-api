import { UserDb } from 'database/UserDb';
import { errorResponse } from '../error/errorResponse';
import { IncomingMessage, ServerResponse } from 'http';
import { IServerResponse } from 'types';

export const put = (
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

  req.setEncoding('utf8');
  let rawData = '';
  req.on('data', (chunk) => {
    rawData += chunk;
  });

  req.on('end', () => {
    try {
      if (urlParts && urlParts[3]) {
        const userId = urlParts[3];
        const parsedData = JSON.parse(rawData);
        serverResponse = db.updateUserData(userId, parsedData);
        const { status, users } = serverResponse;
        res.statusCode = status.code;

        if (status.code === 200) {
          res.end(JSON.stringify(users && users[0]));
          return;
        }
        res.end(JSON.stringify(status.message));
      }
    } catch (err) {
      console.log(err);
      res.statusCode = 400;
      res.end('Please use correct JSON format');
    }
  });
};
