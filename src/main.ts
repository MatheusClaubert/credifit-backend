import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Validação global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  // CORS habilitado para o frontend
  app.enableCors({
    origin: 'http://localhost:3000', // Next.js default
  });

  await app.listen(3001);
}
bootstrap();
