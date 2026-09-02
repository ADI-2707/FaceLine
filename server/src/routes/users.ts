import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { supabaseAdmin } from '../db/supabase.js';

export const usersRouter: Router = Router();

usersRouter.use(authMiddleware);

usersRouter.get('/search', async (req: Request, res: Response): Promise<void> => {
  const query = req.query.query as string;
  if (!query || query.trim().length === 0) {
    res.status(200).json([]);
    return;
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, avatar_glb_url, avatar_thumbnail_url')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(20);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
});

usersRouter.put('/profile', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { name, avatarGlbUrl, avatarThumbnailUrl } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const updates: Record<string, any> = {};
  if (name) updates.name = name;
  if (avatarGlbUrl) updates.avatar_glb_url = avatarGlbUrl;
  if (avatarThumbnailUrl) updates.avatar_thumbnail_url = avatarThumbnailUrl;

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
});
