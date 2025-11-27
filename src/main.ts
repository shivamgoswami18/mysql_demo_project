import * as dotenv from 'dotenv';
dotenv.config();
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './libs/helpers/exception-filter/exception.filter';
import { Messages } from './libs/utility/constants/message';
import path from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe());
  
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapterHost));
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Demo Project API')
    .setDescription('API documentation of Demo Project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'));
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  Logger.log(`${Messages.SERVER_LISTEN} http://localhost:${PORT}`);
}

void bootstrap();
