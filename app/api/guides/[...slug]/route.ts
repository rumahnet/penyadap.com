import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { allDocs } from "contentlayer/generated";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    // 1. Verify Supabase session on backend
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Find document from Contentlayer
    const slug = params.slug?.join("/") || "";
    const doc = allDocs.find((doc) => doc.slugAsParams === slug);

    if (!doc) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // 3. Return only authenticated user's content
    return NextResponse.json({
      success: true,
      title: doc.title,
      description: doc.description,
      body: doc.body.code,
      images: doc.images,
    });
  } catch (error) {
    console.error("Guide fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
