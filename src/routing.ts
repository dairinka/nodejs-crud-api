import { post } from './routing/post';
import { get } from './routing/get';
import { put } from './routing/put';
import { del } from './routing/delete';
import { IncomingMessage, ServerResponse } from 'http';
import { errorResponse } from './error/errorResponse';

export const routing = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  res.setHeader('Content-Type', 'application/json');
  switch (req.method) {
    case 'POST':
      post(req, res);
      break;
    case 'GET':
      get(req, res);
      break;
    case 'PUT':
      put(req, res);
      break;
    case 'DELETE':
      del(req, res);
      break;
    default:
      errorResponse(res, 404, `you can't use ${req.method} method`);
  }
  res.end();
};
