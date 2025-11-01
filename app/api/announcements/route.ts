import { NextRequest, NextResponse } from "next/server";
import { createData, getData } from "@/lib/supabaseUtils";
import { Announcement } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

// GET - Fetch all announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const priority = searchParams.get("priority");
    const status = searchParams.get("status");

    let filters: Record<string, any> = {};
    if (priority) filters.priority = priority;
    if (status) filters.status = status;

    const announcements = await getData<Announcement>("rtrw_announcements", Object.keys(filters).length > 0 ? filters : undefined);
    
    if (announcements === null) {
      return NextResponse.json(
        { error: "Failed to fetch announcements" },
        { status: 500 }
      );
    }

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new announcement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, descriptions, priority, status } = body;

    // Validation
    if (!title || !descriptions || !priority || !status) {
      return NextResponse.json(
        { error: "Missing required fields: title, descriptions, priority, status" },
        { status: 400 }
      );
    }

    if (!["rendah", "sedang", "tinggi"].includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority. Must be 'rendah', 'sedang', or 'tinggi'" },
        { status: 400 }
      );
    }

    if (!["draft", "published"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'draft' or 'published'" },
        { status: 400 }
      );
    }

    const newAnnouncement = {
      title,
      descriptions,
      priority,
      status,
      uuid: uuidv4(),
      created_at: new Date().toISOString(),
    };

    const result = await createData<Announcement>("rtrw_announcements", newAnnouncement);
    
    if (result === null) {
      return NextResponse.json(
        { error: "Failed to create announcement" },
        { status: 500 }
      );
    }

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}