import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { supabaseAdmin } from '../db/supabase.js';

export const keysRouter: Router = Router();

keysRouter.use(authMiddleware);

keysRouter.post('/upload', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { deviceId, identityKeyCurve25519, identityKeyEd25519, oneTimeKeys } = req.body;

  if (!userId || !deviceId || !identityKeyCurve25519 || !identityKeyEd25519) {
    res.status(400).json({ error: 'Missing required device key parameters' });
    return;
  }

  const { error: deviceError } = await supabaseAdmin
    .from('device_keys')
    .upsert({
      user_id: userId,
      device_id: deviceId,
      identity_key_curve25519: identityKeyCurve25519,
      identity_key_ed25519: identityKeyEd25519
    }, { onConflict: 'user_id,device_id' });

  if (deviceError) {
    res.status(500).json({ error: deviceError.message });
    return;
  }

  if (Array.isArray(oneTimeKeys) && oneTimeKeys.length > 0) {
    const records = oneTimeKeys.map((otk: { keyId: number; publicKey: string }) => ({
      user_id: userId,
      device_id: deviceId,
      key_id: otk.keyId,
      public_key: otk.publicKey,
      claimed: false
    }));

    await supabaseAdmin
      .from('one_time_keys')
      .upsert(records, { onConflict: 'user_id,device_id,key_id' });
  }

  res.status(200).json({ status: 'ok', message: 'Keys uploaded successfully' });
});

keysRouter.get('/:targetUserId', async (req: Request, res: Response): Promise<void> => {
  const { targetUserId } = req.params;

  const { data: deviceData, error: deviceError } = await supabaseAdmin
    .from('device_keys')
    .select('*')
    .eq('user_id', targetUserId)
    .single();

  if (deviceError || !deviceData) {
    res.status(444).json({ error: 'Target user device keys not found' });
    return;
  }

  const { data: otkData } = await supabaseAdmin
    .from('one_time_keys')
    .select('*')
    .eq('user_id', targetUserId)
    .eq('claimed', false)
    .limit(1)
    .single();

  if (otkData) {
    await supabaseAdmin
      .from('one_time_keys')
      .update({ claimed: true })
      .eq('id', otkData.id);
  }

  res.status(200).json({
    userId: deviceData.user_id,
    deviceId: deviceData.device_id,
    identityKeyCurve25519: deviceData.identity_key_curve25519,
    identityKeyEd25519: deviceData.identity_key_ed25519,
    keyId: otkData?.key_id || 0,
    oneTimeKey: otkData?.public_key || ''
  });
});
