"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function sendMessage(userId: string, subject: string, content: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("messages")
      .insert([
        {
          user_id: userId,
          subject: subject.trim(),
          content: content.trim(),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    // After inserting, clean up old messages (keep only 30 most recent)
    await cleanupOldMessages();

    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error("Error sending message:", error);
    return { success: false, error: error.message };
  }
}

export async function getMessages() {
  try {
    // Get all messages sorted by newest first
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return { success: false, error: error.message };
  }
}

export async function getMessageCount() {
  try {
    const { count, error } = await supabaseAdmin
      .from("messages")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error: any) {
    console.error("Error counting messages:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMessage(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting message:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAllMessages() {
  try {
    const { error } = await supabaseAdmin
      .from("messages")
      .delete()
      .neq("id", ""); // Delete all

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting all messages:", error);
    return { success: false, error: error.message };
  }
}

async function cleanupOldMessages() {
  try {
    // Get all messages sorted by newest first
    const { data: allMessages, error: fetchError } = await supabaseAdmin
      .from("messages")
      .select("id")
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;

    // If we have more than 30 messages, delete the oldest ones
    if (allMessages && allMessages.length > 30) {
      // Get IDs of messages to delete (skip the first 30 newest ones)
      const idsToDelete = allMessages.slice(30).map((msg) => msg.id);

      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabaseAdmin
          .from("messages")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
        console.log(`Deleted ${idsToDelete.length} old messages (keeping 30 most recent)`);
      }
    }
  } catch (error) {
    console.error("Error during message cleanup:", error);
  }
}