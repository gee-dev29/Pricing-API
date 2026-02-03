import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS Configuration
  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string>('CORS_ORIGINS') || '*';
  const corsCredentials =
    configService.get<boolean>('CORS_CREDENTIALS') || true;

  const corsOptions = {
    origin:
      corsOrigins === '*'
        ? true
        : corsOrigins.split(',').map((origin: string) => origin.trim()),
    credentials: corsCredentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
  };

  app.enableCors(corsOptions);
  console.log(
    'CORS enabled with origins:',
    corsOrigins === '*' ? 'All origins' : corsOrigins,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = parseInt(
    process.env.PORT || configService.get<string>('PORT') || '8500',
  );
  await app.listen(port);
  console.log(`Application running on port http://localhost:${port}`);
}
bootstrap();
