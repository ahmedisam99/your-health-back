import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as morgan from 'morgan';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';
import { UserRolesGuard } from 'guards/user-roles.guard';

async function bootstrap() {
  const PORT = process.env.PORT;
  const NODE_ENV = process.env.NODE_ENV;

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'https://your-health.today',
    ],
    credentials: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(morgan('[:date[clf]] :method :url :status - :response-time ms'));
  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", 'https://*.googleapis.com'],
          baseUri: ["'self'"],
          blockAllMixedContent: [],
          fontSrc: ["'self'", 'https:', 'data:'],
          formAction: ["'self'"],
          frameAncestors: ["'self'"],
          imgSrc: ["'self'", 'https:', 'data:'],
          objectSrc: ["'none'"],
          scriptSrc: [
            "'self'",
            'https://*.googleapis.com',
            'https://*.gstatic.com',
            '*.google.com',
            'https://*.ggpht.com',
            '*.googleusercontent.com',
          ],
          scriptSrcAttr: ["'none'"],
          styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new UserRolesGuard(reflector),
  );

  await app.listen(PORT, () => {
    Logger.log(`Running in ${NODE_ENV} mode`);
  });
}

bootstrap();
