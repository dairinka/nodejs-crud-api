import { createServer } from 'http';
import { routing } from './routing';

const server = createServer(routing);
//   res.setHeader('Content-Type', 'application/json');
//   res.writeHead(200);
//   res.end(`{"message": "This is a JSON response"}`);
// });

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port`, process.env.PORT);
});
