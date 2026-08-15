import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function IsR2Url(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isR2Url',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const r2PublicUrl = process.env.R2_PUBLIC_URL;
                    if (!r2PublicUrl) return false;

                    if (Array.isArray(value)) {
                        return value.every(
                            (url: string) =>
                                typeof url === 'string' &&
                                url.startsWith(r2PublicUrl),
                        );
                    }

                    return (
                        typeof value === 'string' &&
                        value.startsWith(r2PublicUrl)
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid R2 URL`;
                },
            },
        });
    };
}
