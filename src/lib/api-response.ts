import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/config/constants";

export const toErrorResponse = (error: unknown) => {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, ...(error.field && { field: error.field }) },
      { status: error.status }
    );
  }

  console.error("Unexpected error:", error);

  return NextResponse.json(
    { error: ERROR_MESSAGES.UNEXPECTED },
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
  );
};