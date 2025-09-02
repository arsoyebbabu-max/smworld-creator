import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface Message {
  id: string;
  from_user_id: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user, isAdmin]);

  const loadMessages = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        query = query.eq('from_user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (subject: string, messageContent: string) => {
    if (!user) {
      toast({
        title: "লগইন প্রয়োজন",
        description: "মেসেজ পাঠাতে প্রথমে লগইন করুন।",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          from_user_id: user.id,
          subject,
          message: messageContent,
          to_admin: true,
        });

      if (error) throw error;
      
      await loadMessages();
      toast({
        title: "সফল!",
        description: "আপনার মেসেজ পাঠানো হয়েছে।",
      });
      return true;
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "মেসেজ পাঠাতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
      return false;
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!isAdmin) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
      await loadMessages();
      return true;
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "মেসেজ আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
      return false;
    }
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.is_read).length;
  };

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    getUnreadCount,
    refetch: loadMessages,
  };
};