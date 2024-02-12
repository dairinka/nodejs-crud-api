import { createServer } from 'http';
import { routing } from './routing';
import 'dotenv/config';

const server = createServer(routing);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port`, process.env.PORT);
});
