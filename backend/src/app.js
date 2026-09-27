import express from 'express';
import path from 'path';
import cors from 'cors';
import { router as todoRouter} from './routes/todo_route.js';

const app = express();

app.use(cors());

app.use('/todos', express.json(), todoRouter);

app.get('/users', (req, res) => {
  res.send([]);
})


import 'dotenv/config';

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));