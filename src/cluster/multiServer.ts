import { availableParallelism } from 'os';
import { createServer } from 'http';
import { routing } from '../routing';
import cluster from 'cluster';

const instanceNumber = availableParallelism();
const PORT = 6000;

export const multiServer = () => {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < instanceNumber; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    createServer(routing).listen(PORT, () => {
      console.log(`Server is running on port`, PORT);
    });
  }
};
