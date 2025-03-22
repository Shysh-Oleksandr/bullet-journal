import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 8001;

  app.enableCors();
  console.log(`Starting server on port ${port}...`);
  await app.listen(port);
  console.log(`Server started on port ${port}`);
}

void bootstrap();
