import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  (ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }));

  const config = new DocumentBuilder()
    .setTitle('user-management-system')
    .setDescription('Role Based User Management System')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
