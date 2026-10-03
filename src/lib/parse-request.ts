import type { z } from "zod";
import { ApiError } from "@/lib/api-error";
import { BODY_FIELD, ERROR_MESSAGES, HTTP_STATUS } from "@/config/constants";

export const readJsonBody = async (request: Request): Promise<unknown> => {
  try {
    return await request.json();
  } catch {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.INVALID_JSON,
      BODY_FIELD
    );
  }
};

export const parseWithSchema = <Output>(
  schema: z.ZodType<Output>,
  data: unknown
): Output => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const fieldName = firstIssue.path.join(".") || BODY_FIELD;
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, firstIssue.message, fieldName);
  }

  return result.data;
};