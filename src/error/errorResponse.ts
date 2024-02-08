import { IncomingMessage, ServerResponse } from 'http';

export const errorResponse = (
  res: ServerResponse<IncomingMessage>,
  status: number,
  message: string,
) => {
  res.writeHead(status);
  res.write(JSON.stringify({ error: message }));
};
