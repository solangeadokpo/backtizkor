import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";
import { MemorialsModule } from "./memorials/memorials.module";
import { FamilyMembersModule } from "./family-members/family-members.module";
import { TestimonialsModule } from "./testimonials/testimonials.module";

@Module({
  imports: [
    RolesModule,
    UsersModule,
    AuthModule,
    MemorialsModule,
    FamilyMembersModule,
    TestimonialsModule,
  ],
  exports: [RolesModule, UsersModule, AuthModule],
  providers: [],
})
export class BaseModule {}
