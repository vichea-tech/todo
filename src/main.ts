import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useStaticAssets(join(__dirname, '..', 'uploads')); //For Long-Term Compatibility and Consistency with NestJS

  app.use('/uploads', express.static('uploads')); //For Maximum Flexibility and Customization

  await app.listen(process.env.PORT || 3300);
  console.log('=================================');
  console.log(`🏃API is  running on port: ${process.env.PORT || 3300}🏃`);
  console.log('=================================');
}
bootstrap();
