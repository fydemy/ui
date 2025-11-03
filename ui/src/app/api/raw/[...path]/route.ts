import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: paths } = await params;

  try {
    const path = join(process.cwd(), "public", ...paths);
    const content = await readFile(path, "utf-8");

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    return new NextResponse("Not found", { status: 404 });
  }
}
