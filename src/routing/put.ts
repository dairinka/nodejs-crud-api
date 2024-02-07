import { errorResponse } from '../error/errorResponse';
import { IncomingMessage, ServerResponse } from 'http';

export const put = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  if (req.url !== '/api/users') {
    errorResponse(res, 404, 'There is no such endpoint');
  }
};
