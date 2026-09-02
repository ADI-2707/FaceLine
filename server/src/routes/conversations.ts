import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { supabaseAdmin } from '../db/supabase.js';

export const conversationsRouter = Router();

conversationsRouter.use(authMiddleware);

conversationsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { isGroup, name, memberIds } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { data: convData, error: convError } = await supabaseAdmin
    .from('conversations')
    .insert({
      is_group: Boolean(isGroup),
      name: name || null
    })
    .select()
    .single();

  if (convError || !convData) {
    res.status(500).json({ error: convError?.message || 'Failed to create conversation' });
    return;
  }

  const allMembers = Array.from(new Set([userId, ...(Array.isArray(memberIds) ? memberIds : [])]));
  const memberRecords = allMembers.map((mId) => ({
    conversation_id: convData.id,
    user_id: mId,
    role: mId === userId ? 'admin' : 'member'
  }));

  await supabaseAdmin.from('conversation_members').insert(memberRecords);

  res.status(201).json(convData);
});

conversationsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { data: memberRows, error: memberError } = await supabaseAdmin
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId);

  if (memberError || !memberRows) {
    res.status(500).json({ error: memberError?.message });
    return;
  }

  const convIds = memberRows.map((r) => r.conversation_id);
  if (convIds.length === 0) {
    res.status(200).json([]);
    return;
  }

  const { data: convs, error: convsError } = await supabaseAdmin
    .from('conversations')
    .select('*, conversation_members(*, users(*))')
    .in('id', convIds);

  if (convsError) {
    res.status(500).json({ error: convsError.message });
    return;
  }

  res.status(200).json(convs);
});

conversationsRouter.post('/:id/members', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const conversationId = req.params.id;
  const { newMemberIds } = req.body;

  if (!userId || !Array.isArray(newMemberIds)) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  const { data: adminCheck } = await supabaseAdmin
    .from('conversation_members')
    .select('role')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single();

  if (!adminCheck || adminCheck.role !== 'admin') {
    res.status(403).json({ error: 'Only group admins can add members' });
    return;
  }

  const newRecords = newMemberIds.map((mId) => ({
    conversation_id: conversationId,
    user_id: mId,
    role: 'member'
  }));

  const { error: insertError } = await supabaseAdmin
    .from('conversation_members')
    .upsert(newRecords, { onConflict: 'conversation_id,user_id' });

  if (insertError) {
    res.status(500).json({ error: insertError.message });
    return;
  }

  res.status(200).json({ status: 'ok', message: 'Members added successfully' });
});
