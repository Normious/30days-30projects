-- 0005 triggers. Refs: SPEC §10.4
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles; CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS trg_challenges_updated ON challenges; CREATE TRIGGER trg_challenges_updated BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS trg_projects_updated ON projects; CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS trg_org_apps_updated ON organiser_applications; CREATE TRIGGER trg_org_apps_updated BEFORE UPDATE ON organiser_applications FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
DECLARE base_username TEXT; final_username TEXT; counter INTEGER := 1;
BEGIN
  base_username := regexp_replace(split_part(NEW.email, '@', 1), '[^a-z0-9-]', '-', 'g');
  base_username := trim(both '-' from lower(base_username));
  IF length(base_username) < 3 THEN base_username := 'user-' || substr(md5(random()::text), 1, 8); END IF;
  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP counter := counter + 1; final_username := base_username || '-' || counter; END LOOP;
  INSERT INTO public.profiles (id, username, display_name) VALUES (NEW.id, final_username, COALESCE(NEW.raw_user_meta_data->>'full_name', final_username));
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION auto_promote_to_participant() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET platform_role = 'participant', challenge_count = challenge_count + 1, last_participated_at = NOW() WHERE id = NEW.user_id AND platform_role = 'user';
  UPDATE public.profiles SET challenge_count = challenge_count + 1, last_participated_at = NOW() WHERE id = NEW.user_id AND platform_role != 'user';
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_auto_participant ON challenge_participants;
CREATE TRIGGER trg_auto_participant AFTER INSERT ON challenge_participants FOR EACH ROW EXECUTE FUNCTION auto_promote_to_participant();

CREATE OR REPLACE FUNCTION track_project_creation() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET project_count = project_count + 1 WHERE id = (SELECT user_id FROM public.project_authors WHERE project_id = NEW.id AND role = 'author' LIMIT 1);
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_project_count ON projects;
CREATE TRIGGER trg_project_count AFTER INSERT ON projects FOR EACH ROW EXECUTE FUNCTION track_project_creation();

CREATE OR REPLACE FUNCTION log_role_change() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.platform_role IS DISTINCT FROM NEW.platform_role THEN
    INSERT INTO public.user_role_history (user_id, old_role, new_role, reason) VALUES (NEW.id, OLD.platform_role, NEW.platform_role, 'role_update');
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_role_history ON profiles;
CREATE TRIGGER trg_role_history AFTER UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION log_role_change();

CREATE OR REPLACE FUNCTION sync_challenge_primary_organiser() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'organiser' AND NEW.is_primary = TRUE THEN
    UPDATE public.challenges SET primary_organiser_id = NEW.user_id WHERE id = NEW.challenge_id;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.is_primary = TRUE AND NEW.is_primary = FALSE THEN
    IF NOT EXISTS (SELECT 1 FROM public.challenge_participants WHERE challenge_id = NEW.challenge_id AND role = 'organiser' AND is_primary = TRUE AND user_id != NEW.user_id) THEN
      RAISE EXCEPTION 'Cannot remove primary flag — challenge must have a primary organiser';
    END IF;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_sync_primary_organiser ON challenge_participants;
CREATE TRIGGER trg_sync_primary_organiser AFTER INSERT OR UPDATE ON challenge_participants FOR EACH ROW EXECUTE FUNCTION sync_challenge_primary_organiser();

CREATE OR REPLACE FUNCTION handle_project_approval() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN NEW.published_at := NOW(); END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_project_published ON projects;
CREATE TRIGGER trg_project_published BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION handle_project_approval();

-- Maintain projects.search_vector (identical content to SPEC §10.3 expression).
CREATE OR REPLACE FUNCTION projects_search_vector_trigger() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tech_stack, ' '), '')), 'B');
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_projects_search_vector ON projects;
CREATE TRIGGER trg_projects_search_vector BEFORE INSERT OR UPDATE OF title, description, tech_stack ON projects FOR EACH ROW EXECUTE FUNCTION projects_search_vector_trigger();
