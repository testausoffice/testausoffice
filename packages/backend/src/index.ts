import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);

const port: number = Number(Bun.env.PORT) || 8080;

const io = require('socket.io')(3001, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: any) => {
  socket.on('get-document', async (slug: any) => {
    if (slug == null) return;

    let document = await prisma.document.findFirst({
      where: {
        id: slug,
      },
    });
    if (document == null) {
      socket.emit('load-document', { error: 404 });
      return;
    }

    socket.join(slug);
    socket.emit('load-document', document.data);

    socket.on('send-changes', (delta: any) => {
      socket.broadcast.to(slug).emit('receive-changes', delta);
    });

    socket.on('save-document', async (data: any) => {
      try {
        await prisma.document.update({
          where: {
            id: slug,
          },
          data: {
            data,
          },
        });
      } catch {
        return;
      }
    });
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/new', async (req: any, res) => {
  let id = uuidv4();

  if (req.body.type == 'document') {
    await prisma.document.create({
      data: {
        id: id,
        data: '',
      },
    });
  }

  await res.send({ type: req.body.type, id });
});

app.delete('/api/delete/:id', (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
