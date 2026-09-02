import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { supabaseAdmin } from '../db/supabase.js';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
}

export function initSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      return next(new Error('Authentication failed'));
    }

    socket.userId = data.user.id;
    socket.userName = data.user.user_metadata?.name || data.user.email || 'User';
    next();
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;
    if (!userId) return;

    socket.on('conversation:join', (conversationId: string) => {
      socket.join(conversationId);
      io.to(conversationId).emit('presence:online', { userId, conversationId });
    });

    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(conversationId);
      io.to(conversationId).emit('presence:offline', { userId, conversationId });
    });

    socket.on('message:send', async (data: { conversationId: string; ciphertext: string; olmMsgType?: number }) => {
      const { conversationId, ciphertext, olmMsgType = 0 } = data;
      
      const { data: insertedMsg } = await supabaseAdmin
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          ciphertext,
          olm_msg_type: olmMsgType
        })
        .select()
        .single();

      io.to(conversationId).emit('message:receive', insertedMsg || {
        id: crypto.randomUUID(),
        conversationId,
        senderId: userId,
        ciphertext,
        olmMsgType,
        createdAt: new Date().toISOString()
      });
    });

    socket.on('avatar_message:send', async (data: { conversationId: string; ciphertext: string }) => {
      const { conversationId, ciphertext } = data;

      const { data: insertedAvatarMsg } = await supabaseAdmin
        .from('avatar_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          ciphertext
        })
        .select()
        .single();

      io.to(conversationId).emit('avatar_message:receive', insertedAvatarMsg || {
        id: crypto.randomUUID(),
        conversationId,
        senderId: userId,
        ciphertext,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString()
      });
    });

    socket.on('typing:start', (conversationId: string) => {
      socket.to(conversationId).emit('typing:update', { conversationId, userId, isTyping: true });
    });

    socket.on('typing:stop', (conversationId: string) => {
      socket.to(conversationId).emit('typing:update', { conversationId, userId, isTyping: false });
    });

    socket.on('gesture:trigger', (data: { conversationId: string; gestureType: string; expressionType?: string }) => {
      const { conversationId, gestureType, expressionType } = data;
      io.to(conversationId).emit('gesture:event', {
        conversationId,
        userId,
        gestureType,
        expressionType,
        timestamp: Date.now()
      });
    });

    socket.on('screenshot:taken', async (data: { conversationId: string }) => {
      const { conversationId } = data;
      const actorName = socket.userName || 'Someone';

      io.to(conversationId).emit('screenshot:alert', {
        conversationId,
        takenByUserId: userId,
        takenByName: actorName,
        timestamp: Date.now()
      });

      const { data: members } = await supabaseAdmin
        .from('conversation_members')
        .select('user_id')
        .eq('conversation_id', conversationId)
        .neq('user_id', userId);

      if (members && members.length > 0) {
        const notifRecords = members.map((m) => ({
          user_id: m.user_id,
          type: 'screenshot',
          conversation_id: conversationId,
          actor_name: actorName,
          read: false
        }));

        await supabaseAdmin.from('notifications').insert(notifRecords);
      }
    });

    socket.on('disconnect', () => {
      io.emit('presence:offline', { userId });
    });
  });

  return io;
}
