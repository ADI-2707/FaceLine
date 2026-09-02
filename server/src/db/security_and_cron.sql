ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_time_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all user profiles"
  ON users FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Members can view conversations"
  ON conversations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_members.conversation_id = conversations.id
      AND conversation_members.user_id = auth.uid()
  ));

CREATE POLICY "Members can view messages"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_members.conversation_id = messages.conversation_id
      AND conversation_members.user_id = auth.uid()
  ));

CREATE POLICY "Members can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_members.conversation_id = messages.conversation_id
      AND conversation_members.user_id = auth.uid()
  ));

CREATE POLICY "Members can view avatar messages"
  ON avatar_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_members.conversation_id = avatar_messages.conversation_id
      AND conversation_members.user_id = auth.uid()
  ));

CREATE POLICY "Members can send avatar messages"
  ON avatar_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_members.conversation_id = avatar_messages.conversation_id
      AND conversation_members.user_id = auth.uid()
  ));

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'purge-expired-avatar-messages',
  '0 * * * *',
  $$ DELETE FROM avatar_messages WHERE expires_at < NOW() $$
);
