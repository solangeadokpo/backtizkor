import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from "class-validator";
import { Model } from "mongoose";

@ValidatorConstraint({ async: true })
export class ExistsConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [model, field] = args.constraints;

    if (Array.isArray(value)) {
      const count = await model.countDocuments({ [field]: { $in: value } });
      return count === value.length;
    }

    const count = await model.countDocuments({ [field]: value });
    return count > 0;
  }

  defaultMessage(args: ValidationArguments): string {
    const [model, field] = args.constraints;
    return `${field} not exists.`;
  }
}

export function IsExists(
  model: Model<any>,
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    const field = property || propertyName;
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, field],
      validator: ExistsConstraint,
    });
  };
}
