import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiDocsConfig = new DocumentBuilder()
    .setTitle('backend home test')
    .setDescription('The home test api docs')
    .setVersion('1.0')
    .build();

  const apiDocs = SwaggerModule.createDocument(app, apiDocsConfig);
  SwaggerModule.setup('api', app, apiDocs);

  await app.listen(3000);
}
bootstrap();
