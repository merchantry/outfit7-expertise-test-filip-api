import { PrismaError } from 'src/types';

/**
 * Type guard to check if an error is a Prisma error.
 * Used for error handling in services.
 */
export function isPrismaError(error: unknown): error is PrismaError {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof (error as PrismaError).code === 'string'
  );
}
