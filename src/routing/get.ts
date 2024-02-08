import { errorResponse } from '../error/errorResponse';
import { IncomingMessage, ServerResponse } from 'http';
export const get = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  // if (req.url !== '/api/users') {
  // }
  switch (req.url) {
    case '/api/users':
      res.writeHead(200);
      res.write('books');
      break;
    case '/authors':
      res.writeHead(200);
      res.write('authors');
      break;
    default: {
      // res.writeHead(404);
      // res.end('There is no such endpoint');
      errorResponse(res, 404, 'There is no such endpoint');
    }
  }
};
