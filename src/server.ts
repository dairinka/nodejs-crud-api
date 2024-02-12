import { createServer } from 'http';
import { routing } from './routing';
import 'dotenv/config';

export const server = createServer(routing);
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port`, port);
});
