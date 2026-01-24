import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Angular frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global API prefix
  app.setGlobalPrefix('api');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('BiblioManager API')
    .setDescription(
      'API de gerenciamento de biblioteca - Sistema completo de controle de livros, clientes e reservas',
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e controle de acesso')
    .addTag('livros', 'Gerenciamento de livros do acervo')
    .addTag('clientes', 'Gerenciamento de clientes da biblioteca')
    .addTag('reservas', 'Gerenciamento de reservas e empréstimos')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'BiblioManager API Docs',
    customfavIcon: 'https://nestjs.com/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
  console.log(
    `📚 Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
bootstrap();
