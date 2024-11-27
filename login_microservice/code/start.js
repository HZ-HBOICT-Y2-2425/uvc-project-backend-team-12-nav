// start.js setup from learnnode.com by Wes Bos
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package

dotenv.config({ path: 'variables.env' });
import indexRouter from './routes/index.js';

const app = express();

// Enable CORS middleware
app.use(cors());

// Support JSON encoded and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the index router
app.use('/', indexRouter);

app.set('port', process.env.PORT || 3012);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
