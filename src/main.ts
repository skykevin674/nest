import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bodyParser = require('body-parser');
import { DecryptPipe } from './pipe/decrypt.pipe';
import { WsAdapter } from '@nestjs/platform-ws';
import cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.text());
  app.use(cors());
  app.useGlobalPipes(new DecryptPipe());
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3000);
}
bootstrap();
