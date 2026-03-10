import { supabase } from './supabaseClient';

export const createNotification = async (userId, type, content, listingId = null, referenceId = null) => {
  if (!userId) return;
  
  const { error } = await supabase
    .from('notifications')
    .insert([
      { 
        user_id: userId, 
        type, 
        content, 
        listing_id: listingId, 
        reference_id: referenceId 
      }
    ]);
  
  if (error) console.error("Error creating notification:", error);
};

export const startChat = async (buyerId, sellerId, listingId) => {
  // Check if chat already exists
  const { data: existing } = await supabase
    .from('chats')
    .select('id')
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .eq('listing_id', listingId)
    .single();

  if (existing) return existing.id;

  // Otherwise create new
  const { data, error } = await supabase
    .from('chats')
    .insert([{ buyer_id: buyerId, seller_id: sellerId, listing_id: listingId }])
    .select()
    .single();

  if (error) throw error;

  // Send initial automated message from buyer
  await supabase
    .from('messages')
    .insert([{
      chat_id: data.id,
      sender_id: buyerId,
      content: 'Hola, me interesa este predio. Quisiera más información.'
    }]);

  return data.id;
};
