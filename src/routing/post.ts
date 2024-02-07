import { errorResponse } from '../error/errorResponse';
import { IncomingMessage, ServerResponse } from 'http';

export const post = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  // switch(req.url){
  //   case '/api/users':
  //     break;
  //   default:
  //     errorResponse(res, 404, 'There is no such endpoint');
  // }
  console.log('req.url', req.url);
  if (req.url !== '/api/users') {
    errorResponse(res, 404, 'There is no such endpoint');
    return;
  }
  res.end('good post query');
};
