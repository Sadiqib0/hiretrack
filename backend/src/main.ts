import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS - IMPORTANT for file uploads
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Security
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  
  app.use(compression());
  
  // Validation
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true 
  }));

  // Serve static files (uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('HireTrack API')
    .setDescription('Job application tracking API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 HireTrack API is running on: http://localhost:${port}`);
  console.log(`📁 Uploads directory: ${join(__dirname, '..', 'uploads')}`);
}
bootstrap();