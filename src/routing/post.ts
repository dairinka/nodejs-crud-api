import { UserDb } from 'database/UserDb';
import { errorResponse } from '../error/errorResponse';
import { IncomingMessage, ServerResponse } from 'http';

//import { IUserDb } from 'types';

export const post = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  db: UserDb,
) => {
  if (req.url !== '/api/users') {
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
      const parsedData = JSON.parse(rawData);

      const serverResponse = db.addUser(parsedData);

      const { status, users } = serverResponse;
      res.statusCode = status.code;

      if (status.code === 201) res.end(JSON.stringify(users && users[0]));
      res.end(status.message);
    } catch (err) {
      console.error(err);
      res.statusCode = 400;
      res.end('Please use correct JSON format');
    }
  });
};
