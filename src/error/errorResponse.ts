import { IncomingMessage, ServerResponse } from 'http';

export const errorResponse = (
  res: ServerResponse<IncomingMessage>,
  status: number,
  message: string,
) => {
  res.writeHead(status);
  res.end(`error: ${message}`);
};
