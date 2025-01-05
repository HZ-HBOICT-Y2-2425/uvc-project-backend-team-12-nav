// start.js
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import indexRouter from './routes/index.js';

dotenv.config({ path: 'variables.env' });

const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

// Support JSON encoded and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the index router
app.use('/', indexRouter);

app.set('port', process.env.PORT || 3012);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});