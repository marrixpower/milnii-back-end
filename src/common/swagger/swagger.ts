import { readFileSync } from 'fs';

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Milnii API docs')
    .setDescription('Milnii API')
    .setVersion(process.env.npm_package_version)
    .addBearerAuth(
      {
        description: 'Please enter firebase JWT token',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'user-token',
    )
    .addBearerAuth(
      {
        description: 'Please enter JWT token',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'admin-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      tagsSorter: function (a: string, b: string) {
        if (a.includes('(Admin)') && b.includes('(Admin)'))
          return a > b ? 1 : -1;
        if (a.includes('(Admin)')) return 1;
        if (b.includes('(Admin)')) return -1;
        return a > b ? 1 : -1;
      },
    },
    customCss: readFileSync('swagger.css', 'utf-8'),
  });
}

