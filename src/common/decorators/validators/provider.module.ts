import { Module } from "@nestjs/common";
import { ExistsConstraint } from "./is-exists.validtor";
import { IsObjectIdConstraint } from "./is-object-id.validator";

@Module({
  providers: [ExistsConstraint, IsObjectIdConstraint],
  exports: [ExistsConstraint, IsObjectIdConstraint],
})
export class ValidationProviderModule {}
