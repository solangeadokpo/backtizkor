import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  HttpStatus,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { useContainer } from "class-validator";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { MongoValidationExceptionFilter } from "./common/filters/mongo-validation-exception.filter";
import { ValidationExceptionFilter } from "./common/filters/validation-exception.filter";
import { UserContextInterceptor } from "./common/interceptors/user-context.interceptor";
import { MongoSerializerInterceptor } from "./common/interceptors/mongo-serializer.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix("api");
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new MongoValidationExceptionFilter(),
    new ValidationExceptionFilter(),
  );
  app.useGlobalInterceptors(
    new UserContextInterceptor(),
    new MongoSerializerInterceptor(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validationError: {
        target: true,
        value: true,
      },
    }),
  );
  // app.use(cookieParser());
  app.use(helmet());

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    exposedHeaders: ["Authorization"],
    allowedHeaders: ["Authorization", "Content-Type"],
  });

  configOpenApiDoc(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(process.env.PORT ?? 3001);
}

export function configOpenApiDoc(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Tikzor API Documentation")
    .setDescription("Tikzor API")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "access-token",
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
}

bootstrap();
