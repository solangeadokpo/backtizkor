import { Module } from "@nestjs/common";
import { DatabaseProvider } from "./database.providers";
import { RolesSeeder } from "./seeders/roles.seeder";
import { RolesModule } from "src/modules/roles/roles.module";

@Module({
  imports: [DatabaseProvider, RolesModule],
  providers: [RolesSeeder],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
