import { NextResponse } from "next/server";
import { HTTP_STATUS } from "@/config/constants";
import { toErrorResponse } from "@/lib/api-response";
import { parseWithSchema, readJsonBody } from "@/lib/parse-request";
import { checkToneInputSchema } from "@/llm/schema";
import { checkTone } from "@/services/check-tone";

export const POST = async (request: Request) => {
  try {
    const body = await readJsonBody(request);
    const input = parseWithSchema(checkToneInputSchema, body);
    const output = await checkTone(input);

    return NextResponse.json(output, { status: HTTP_STATUS.OK });
  } catch (error) {
    return toErrorResponse(error);
  }
};