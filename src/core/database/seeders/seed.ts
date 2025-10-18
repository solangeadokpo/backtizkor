import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { RolesSeeder } from "./roles.seeder";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const rolesSeeder = app.get(RolesSeeder);
  await rolesSeeder.seed();
  await app.close();
}

bootstrap();
