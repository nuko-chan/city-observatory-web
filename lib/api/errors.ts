export class APIError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
  }
}

export function handleAPIError(error: unknown): APIError {
  if (error instanceof Response) {
    return new APIError(error.statusText, error.status, `HTTP_${error.status}`);
  }
  if (error instanceof Error) {
    return new APIError(error.message);
  }
  return new APIError("Unknown error occurred");
}
