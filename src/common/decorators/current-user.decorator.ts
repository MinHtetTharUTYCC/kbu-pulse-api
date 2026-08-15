import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (required: boolean = true, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const userId = request.headers['x-user-id'];

        if (required && !userId) {
            throw new UnauthorizedException(
                'Authentication required. Missing x-user-id header.',
            );
        }

        return userId as string | undefined;
    },
);
