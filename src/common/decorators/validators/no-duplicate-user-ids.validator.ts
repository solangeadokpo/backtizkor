import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export function NoDuplicateUserIds(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "NoDuplicateUserIds",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          if (!Array.isArray(value)) return false;

          const seen = new Set();
          for (const item of value) {
            if (!item?.user_id) continue;
            const key = item.user_id.toString();
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
          }
          return true;
        },

        defaultMessage(args: ValidationArguments) {
          return `family_members contains duplicate user_id values.`;
        },
      },
    });
  };
}
