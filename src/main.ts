import { NestFactory } from '@nestjs/core';
import "dotenv/config"
import "module-alias/register"
import { AppModule } from './app.module';
import logger from "morgan"
import cookie from "cookie-parser"
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000
  app.enableCors()
  app.use(logger('dev'))
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookie(process.env.JWT_SECRET as string))

  await app.listen(PORT, () => {
    console.log(`Server running on port :::->${PORT}`);
  });
}
bootstrap();
