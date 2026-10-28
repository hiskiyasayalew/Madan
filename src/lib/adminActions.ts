"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ... existing getPendingRequests and getAllUsers ...
export async function getFrontendCards() {
  const { data, error } = await supabaseAdmin
    .from("frontend_cards")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertFrontendCard(
  cardData: Record<string, unknown> & { id?: string }
) {
  // Ensure we don't send a null ID for a new record
  const cleanData = { ...cardData };
  if (!cleanData.id) delete cleanData.id;

  const { data, error } = await supabaseAdmin
    .from("frontend_cards")
    .upsert(cleanData)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteFrontendCard(id: string) {
  const { error } = await supabaseAdmin
    .from("frontend_cards")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getAllUsers() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPendingRequests() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("status", "pending");
  if (error) throw error;
  return data;
}

// CREATE USER (Manual)
export async function createAdminUser(
  userData: Record<string, unknown> & { email: string; password?: string }
) {
  // 1. Create auth user with the specific password entered by the Admin
  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password || "TempPassword123!", // uses the admin's chosen password
      email_confirm: true,
    });

  if (authError) throw authError;

  // 2. Extract password so we do NOT send it to the public 'users' table
  const { password: _password, ...cleanUserData } = userData;

  // 3. Insert into your users table
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert([
      {
        id: authUser.user.id, // 🔑 matches Auth UID
        ...cleanUserData,
        status: "active",
        role: "user",
      },
    ])
    .select();

  if (error) throw error;

  return data[0];
}

// UPDATE USER
export async function updateUser(
  id: string,
  userData: Record<string, unknown>
) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update(userData)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
}

// DELETE USER
export async function deleteUser(id: string) {
  const { error } = await supabaseAdmin
    .from("users")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}

export async function getSubAdmins() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .or("role.eq.sub-admin, assigned_service.neq.{}");
  if (error) throw error;
  return data;
}

// lib/adminActions.ts
export async function promoteToSubAdmin(userId: string, serviceTypes: string[]) {
  try {
    // Ensure we don't assign duplicates
    const uniqueRoles = [...new Set(serviceTypes)];

    // If any role is a manager (not "Church Leaders"), grant sub-admin role
    const hasManagerRole = uniqueRoles.some((s) => s !== "Church Leaders");

    const updateData: { assigned_service: string[]; role: string } = {
      assigned_service: uniqueRoles,
      role: hasManagerRole ? "sub-admin" : "user",
    };

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (err: unknown) {
    console.error("Promotion Action Failed:", err);
    throw err;
  }
}

// --- INVENTORY ACTIONS ---

export async function getInventory() {
  const { data, error } = await supabaseAdmin
    .from("inventory")
    .select("*")
    .order("category", { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertInventoryItem(
  itemData: Record<string, unknown> & { id?: string }
) {
  const cleanData = { ...itemData };
  if (!cleanData.id) delete cleanData.id;

  const { data, error } = await supabaseAdmin
    .from("inventory")
    .upsert(cleanData)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteInventoryItem(id: string) {
  const { error } = await supabaseAdmin
    .from("inventory")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function demoteToUser(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({
      role: "user",
      assigned_service: [],
    })
    .eq("id", userId)
    .select();

  if (error) throw error;
  return data[0];
}

// --- SERVICE SUMMARY ACTIONS ---
// lib/adminActions.ts
export async function getLatestSummary() {
  try {
    const { data, error } = await supabaseAdmin
      .from("service_summaries")
      .select("*")
      .order("service_date", { ascending: false })
      .limit(1)
      .maybeSingle(); // maybeSingle prevents errors if no row is found

    if (error) {
      console.error("Summary fetch error:", error);
      return null; // Return null instead of throwing
    }
    return data;
  } catch {
    return null;
  }
}

export async function updateServiceSummary(
  summaryData: Record<string, unknown> & { id?: string }
) {
  // Ensure we don't send a null or empty ID property for a new record
  const cleanData = { ...summaryData };
  if (!cleanData.id) {
    delete cleanData.id;
  }

  const { data, error } = await supabaseAdmin
    .from("service_summaries")
    .upsert(cleanData)
    .select();

  if (error) {
    console.error("Database Error:", error.message);
    throw error;
  }
  return data[0];
}

export async function deleteServiceSummary(id: string) {
  const { error } = await supabaseAdmin
    .from("service_summaries")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}

export async function getReservations() {
  const { data, error } = await supabaseAdmin
    .from("guest_house_reservations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateReservationStatus(
  id: string,
  status: "approved" | "rejected"
) {
  const { data, error } = await supabaseAdmin
    .from("guest_house_reservations")
    .update({ status })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteReservation(id: string) {
  const { error } = await supabaseAdmin
    .from("guest_house_reservations")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ... existing updateRequestStatus ...
export async function updateRequestStatus(
  id: string,
  newStatus: "approved" | "rejected"
) {
  // 1. Fetch the existing request data
  const { data: request, error: fetchError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !request) throw new Error("Request not found");

  // 2. If REJECTED, just delete the profile and (optionally) the auth user
  if (newStatus === "rejected") {
    await supabaseAdmin.from("profiles").delete().eq("id", id);
    // Optional: Delete from auth.users too if you want them totally gone
    await supabaseAdmin.auth.admin.deleteUser(id);
    return { success: true };
  }

  // 3. If APPROVED
  // Check if user already exists in the USERS table to prevent duplicates
  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", request.email)
    .single();

  if (existingUser) {
    // If they are already in the users table, just clean up the profiles table
    await supabaseAdmin.from("profiles").delete().eq("id", id);
    return { success: true, message: "User already existed in database." };
  }

  // 4. Move data to the "users" table
  // We use the ID from the profile because it matches the Auth UID created during signup
  const { error: insertError } = await supabaseAdmin
    .from("users")
    .insert([
      {
        id: request.id, // Use the same ID from profiles/auth
        full_name: request.full_name,
        username: request.username,
        email: request.email,
        phone: request.phone,
        city: request.city, // Added
        subcity: request.subcity, // Added
        woreda: request.woreda,
        gender: request.gender,
        age: request.age,
        marital_status: request.marital_status,
        previous_church: request.previous_church,
        baptism_date: request.baptism_date, // Add this
        baptism_place: request.baptism_place,
        status: "active",
        role: "user",
      },
    ]);

  if (insertError) {
    console.error("Insert Error:", insertError);
    throw new Error("Failed to move user to permanent table");
  }

  // 5. Delete from profiles ONLY after the insert is successful
  await supabaseAdmin.from("profiles").delete().eq("id", id);

  return { success: true };
}

// Add these functions to your existing adminActions.ts
export async function uploadLeaderImage(file: File, fileName: string) {
  try {
    // Upload to storage using service role (bypasses RLS for upload)
    const { error } = await supabaseAdmin.storage
      .from("leader-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error details:", error);
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("leader-images").getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

export async function deleteLeaderImage(imageUrl: string) {
  if (!imageUrl) return;

  const fileName = imageUrl.split("/").pop();
  if (!fileName) return;

  const { error } = await supabaseAdmin.storage
    .from("leader-images")
    .remove([fileName]);

  if (error) console.error("Error deleting image:", error);
}

export async function getLeaderFrontendCards() {
  try {
    const { data, error } = await supabaseAdmin
      .from("leader_cards")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching leaders:", error);
    throw error;
  }
}

export async function upsertLeaderFrontendCard(
  cardData: Record<string, unknown> & { id?: string }
) {
  try {
    const cleanData = { ...cardData };
    if (!cleanData.id) delete cleanData.id;

    const { data, error } = await supabaseAdmin
      .from("leader_cards")
      .upsert(cleanData)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error upserting leader:", error);
    throw error;
  }
}

export async function deleteLeaderFrontendCard(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("leader_cards")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting leader:", error);
    throw error;
  }
}

// lib/adminActions.ts

export async function uploadNewsImage(
  file: File,
  fileName: string,
  userId: string
) {
  try {
    // 1. Check if user has Frontend Manager role
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("assigned_service")
      .eq("id", userId)
      .single();

    if (userError || !user) throw new Error("User not found");
    if (!user.assigned_service?.includes("Frontend Manager")) {
      throw new Error("You do not have permission to upload news images.");
    }

    // 2. Upload
    const { error } = await supabaseAdmin.storage
      .from("frontend-assets")
      .upload(`news-assets/${fileName}`, file, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage
      .from("frontend-assets")
      .getPublicUrl(`news-assets/${fileName}`);
    return publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}