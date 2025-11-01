import { NextRequest, NextResponse } from "next/server";
import { getDataById, updateData, deleteData } from "@/lib/supabaseUtils";
import { Announcement } from "@/lib/types";

// GET - Fetch single announcement by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const announcement = await getDataById<Announcement>("rtrw_announcements", id);
    
    if (announcement === null) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update announcement by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, descriptions, priority, status } = body;

    // Validation for priority if provided
    if (priority && !["rendah", "sedang", "tinggi"].includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority. Must be 'rendah', 'sedang', or 'tinggi'" },
        { status: 400 }
      );
    }

    // Validation for status if provided
    if (status && !["draft", "published"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'draft' or 'published'" },
        { status: 400 }
      );
    }

    const updatePayload: Partial<Announcement> = {};
    if (title !== undefined) updatePayload.title = title;
    if (descriptions !== undefined) updatePayload.descriptions = descriptions;
    if (priority !== undefined) updatePayload.priority = priority;
    if (status !== undefined) updatePayload.status = status;

    const result = await updateData<Announcement>("rtrw_announcements", id, updatePayload);
    
    if (result === null) {
      return NextResponse.json(
        { error: "Failed to update announcement or announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete announcement by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const success = await deleteData("rtrw_announcements", id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete announcement or announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}