import { post } from './routing/post';
import { get } from './routing/get';
import { put } from './routing/put';
import { del } from './routing/delete';
import { IncomingMessage, ServerResponse } from 'http';
import { errorResponse } from './error/errorResponse';
import { currentUserDb } from './database/UserDb';

export const routing = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  const db = currentUserDb;
  res.setHeader('Content-Type', 'application/json');
  console.log('req.method', req.method);
  switch (req.method) {
    case 'POST':
      post(req, res, db);
      break;
    case 'GET':
      get(req, res, db);
      break;
    case 'PUT':
      put(req, res, db);
      break;
    case 'DELETE':
      del(req, res);
      break;
    default:
      errorResponse(res, 404, `you can't use ${req.method} method`);
  }
};
