import { supabase } from './supabaseClient';

// Fetch all news items ordered by the newest first
export const getNewsItems = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error.message);
    return [];
  }
  return data;
};

// Create a new news item and maintain a maximum of 6 records
export const createNewsItem = async (newsData: { title: string; content: string; image_url?: string }) => {
  try {
    // 1. Insert the new news item
    const { data: insertedData, error: insertError } = await supabase
      .from('news')
      .insert([newsData])
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Fetch all news items ordered by date (newest first)
    const { data: allNews, error: fetchError } = await supabase
      .from('news')
      .select('id')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    // 3. If there are more than 6, delete the oldest ones
    if (allNews && allNews.length > 6) {
      const idsToDelete = allNews.slice(6).map((item) => item.id);
      const { error: deleteError } = await supabase
        .from('news')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) throw deleteError;
    }

    return { success: true, data: insertedData };
  } catch (error: any) {
    console.error('Error creating news item:', error.message);
    return { success: false, error: error.message };
  }
};

// Update an existing news item
export const updateNewsItem = async (id: string, updates: { title: string; content: string; image_url?: string }) => {
  const { data, error } = await supabase
    .from('news')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating news item:', error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
};

// Delete a news item
export const deleteNewsItem = async (id: string) => {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting news item:', error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
};