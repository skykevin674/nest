import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bodyParser = require('body-parser');
import { DecryptPipe } from './pipe/decrypt.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.text());
  app.useGlobalPipes(new DecryptPipe());
  await app.listen(3000);
}
bootstrap();
