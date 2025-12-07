import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }
  ));
  app.useGlobalFilters(new HttpExceptionFilter()); //pour le filter d'exception personnalise

  //swagger
  const options = new DocumentBuilder()
    .setTitle('IluvCoffee')
    .setDescription('The coffees API description')
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
