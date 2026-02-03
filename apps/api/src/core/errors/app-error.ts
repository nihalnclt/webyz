export type AppErrorOptions = {
  code: string;
  statusCode?: number;
  details?: unknown;
};

export function createAppError(message: string, options: AppErrorOptions) {
  const error = new Error(message) as Error & {
    code: string;
    statusCode: number;
    details?: unknown;
    isOperational: boolean;
  };

  error.code = options.code;
  error.statusCode = options.statusCode ?? 500;
  error.details = options.details;
  error.isOperational = true;

  return error;
}
