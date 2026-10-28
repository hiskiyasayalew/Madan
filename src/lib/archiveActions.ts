// lib/archiveActions.ts
import { supabase } from './supabaseClient';

export interface PreachingItem {
  id?: string;
  title: string;
  speaker: string;
  description?: string;
  audio_url: string;
  date_preached: string;
  created_at?: string;
}

const MAX_RECORDINGS = 24;

// Helper to safely extract error message from unknown catch variables
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Fetch all audio preaching items
export const getArchiveItems = async (): Promise<PreachingItem[]> => {
  try {
    const { data, error } = await supabase
      .from('preachings')
      .select('*')
      .order('date_preached', { ascending: false })
      .limit(MAX_RECORDINGS);

    if (error) throw error;
    return data || [];
  } catch (error: unknown) {
    console.error("Error fetching preachings:", getErrorMessage(error));
    return [];
  }
};

// Get count of recordings
export const getRecordingCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('preachings')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  } catch (error: unknown) {
    console.error("Error getting recording count:", getErrorMessage(error));
    return 0;
  }
};

// Create a new audio preaching item with auto-cleanup
// lib/archiveActions.ts
export const createArchiveItem = async (item: Omit<PreachingItem, 'id' | 'created_at'>) => {
  try {
    // Get current session to ensure authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Check current count
    const count = await getRecordingCount();
    
    if (count >= MAX_RECORDINGS) {
      console.warn(`Maximum recordings (${MAX_RECORDINGS}) reached. Oldest will be removed.`);
    }

    // Insert the record
    const { data: insertData, error: insertError } = await supabase
      .from('preachings')
      .insert([{
        ...item,
        created_by: session.user.id // Add the user who created it
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    // After insertion, check and enforce max limit
    await enforceMaxRecordings();

    return { success: true, data: insertData };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error creating preaching:", message);
    return { success: false, error: message };
  }
};

// Enforce maximum recordings limit
const enforceMaxRecordings = async () => {
  try {
    const { count, error: countError } = await supabase
      .from('preachings')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    if (count && count > MAX_RECORDINGS) {
      const excess = count - MAX_RECORDINGS;
      
      const { data: oldestRecords, error: fetchError } = await supabase
        .from('preachings')
        .select('id, audio_url')
        .order('date_preached', { ascending: true })
        .limit(excess);

      if (fetchError) throw fetchError;
      if (!oldestRecords || oldestRecords.length === 0) return;

      // Delete audio files from storage
      for (const record of oldestRecords) {
        if (record.audio_url) {
          try {
            await deleteAudioFile(record.audio_url);
          } catch (error: unknown) {
            console.error(`Error deleting audio file:`, error);
          }
        }
      }

      // Delete records from database
      const idsToDelete = oldestRecords.map(r => r.id);
      const { error: deleteError } = await supabase
        .from('preachings')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) throw deleteError;
    }
  } catch (error: unknown) {
    console.error("Error enforcing max recordings:", getErrorMessage(error));
  }
};

// Helper function to delete audio file from storage
const deleteAudioFile = async (audioUrl: string) => {
  try {
    const urlParts = audioUrl.split('/');
    const filePath = urlParts.slice(urlParts.indexOf('preachings') + 1).join('/');
    
    const { error } = await supabase.storage
      .from('audio-files')
      .remove([filePath]);

    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error deleting audio file:", message);
    return { success: false, error: message };
  }
};

// Delete an audio preaching item (manual deletion)
export const deleteArchiveItem = async (id: string) => {
  try {
    const { data: item, error: fetchError } = await supabase
      .from('preachings')
      .select('audio_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (item?.audio_url) {
      await deleteAudioFile(item.audio_url);
    }

    const { error } = await supabase
      .from('preachings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error deleting preaching:", message);
    return { success: false, error: message };
  }
};

// Update an existing audio preaching item
export const updateArchiveItem = async (id: string, updates: Partial<PreachingItem>) => {
  try {
    const { data, error } = await supabase
      .from('preachings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error updating preaching:", message);
    return { success: false, error: message };
  }
};