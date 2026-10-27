// lib/eventActions.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// SHARED VALIDATION LOGIC
async function validateConstraints(date: string, audience_type: string, excludeId?: string) {
  const query = supabaseAdmin
    .from("events")
    .select("id, audience_type")
    .eq("event_date", date);

  if (excludeId) query.neq("id", excludeId);

  const { data: existingEvents } = await query;

  if (existingEvents && existingEvents.length > 0) {
    // 1. If any event on this day is "Full", nobody else can add anything
    if (existingEvents.some(e => e.audience_type === "Full")) {
      throw new Error("This day is off-limits: A 'Full Audience' event is already scheduled.");
    }
    // 2. If the user is trying to make THIS event "Full", but other events already exist
    if (audience_type === "Full") {
      throw new Error("Conflict: Cannot set to 'Full Audience' because other events already exist on this day.");
    }
  }
}

export async function getEvents() {
  const { data, error } = await supabaseAdmin.from("events").select("*").order("event_date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createEvent(eventData: any, creatorId: string) {
  // Check constraints for everyone (Admin and Sub-Admin)
  await validateConstraints(eventData.event_date, eventData.audience_type);

  const { data, error } = await supabaseAdmin
    .from("events")
    .insert([{ ...eventData, created_by: creatorId }])
    .select();

  if (error) throw error;
  revalidatePath("/");
  return data[0];
}

export async function updateEvent(id: string, eventData: any, requestorId: string, requestorRole: string) {
  // 1. Ownership Check - FIXED: Check for admin in a case-insensitive way
  const { data: existing } = await supabaseAdmin.from("events").select("created_by").eq("id", id).single();
  
  // Check if user is admin (case insensitive) OR is the creator
  const isAdmin = requestorRole?.toLowerCase() === 'admin';
  const isCreator = existing?.created_by === requestorId;
  
  console.log('Update Event - Debug:', {
    requestorId,
    requestorRole,
    isAdmin,
    isCreator,
    existingCreator: existing?.created_by,
    eventId: id
  });
  
  if (!isAdmin && !isCreator) {
    throw new Error("Unauthorized: You can only edit events you created.");
  }

  // 2. Constraint Check (exclude current event from check)
  await validateConstraints(eventData.event_date, eventData.audience_type, id);

  const { data, error } = await supabaseAdmin
    .from("events")
    .update(eventData)
    .eq("id", id)
    .select();

  if (error) throw error;
  revalidatePath("/");
  return data[0];
}

export async function deleteEvent(
  id: string,
  requestorId: string
) {
  if (!requestorId) {
    throw new Error("User not authenticated");
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", requestorId)
    .single();

  const isAdmin =
    user?.role?.toLowerCase() === "admin";

  const { data: existing } = await supabaseAdmin
    .from("events")
    .select("created_by")
    .eq("id", id)
    .single();

  const isCreator =
    existing?.created_by === requestorId;

  console.log({
    requestorId,
    role: user?.role,
    isAdmin,
    isCreator
  });

  if (!isAdmin && !isCreator) {
    throw new Error(
      "Unauthorized: You can only delete events you created."
    );
  }

  const { error } = await supabaseAdmin
    .from("events")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/");

  return { success: true };
}