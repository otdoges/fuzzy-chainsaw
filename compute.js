
import { Router } from '@fastly/expressly';
import { NextServer } from '@fastly/next';

const app = new Router();
const next = new NextServer();

app.use(async (req, res) => {
  await next.handle(req, res);
});

app.listen();