import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Types } from "mongoose";

@ValidatorConstraint({ name: "IsObjectId", async: false })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    return Types.ObjectId.isValid(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid Mongo ObjectId`;
  }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsObjectId",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsObjectIdConstraint,
    });
  };
}
