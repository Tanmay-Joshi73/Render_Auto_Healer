import { NestFactory } from '@nestjs/core';
const isProd = process.env.NODE_ENV === 'production';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory:(errors)=>{
        if(isProd){
          return new BadRequestException('Bad request body')
        }
        throw  new BadRequestException(errors)
    }
  }),
);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
