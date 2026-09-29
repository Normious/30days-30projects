-- 0006 RLS helpers + policies. Refs: SPEC §11
-- Helpers
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND platform_role = 'admin'); $$ LANGUAGE sql SECURITY DEFINER STABLE;
CREATE OR REPLACE FUNCTION is_organiser() RETURNS BOOLEAN AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND platform_role IN ('organiser', 'admin')); $$ LANGUAGE sql SECURITY DEFINER STABLE;
CREATE OR REPLACE FUNCTION is_participant() RETURNS BOOLEAN AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND platform_role IN ('participant', 'organiser', 'admin')); $$ LANGUAGE sql SECURITY DEFINER STABLE;
CREATE OR REPLACE FUNCTION is_challenge_organiser(challenge_uuid UUID) RETURNS BOOLEAN AS $$ SELECT EXISTS (SELECT 1 FROM public.challenge_participants WHERE challenge_id = challenge_uuid AND user_id = auth.uid() AND role = 'organiser'); $$ LANGUAGE sql SECURITY DEFINER STABLE;
CREATE OR REPLACE FUNCTION is_challenge_primary_organiser(challenge_uuid UUID) RETURNS BOOLEAN AS $$ SELECT EXISTS (SELECT 1 FROM public.challenge_participants WHERE challenge_id = challenge_uuid AND user_id = auth.uid() AND role = 'organiser' AND is_primary = TRUE); $$ LANGUAGE sql SECURITY DEFINER STABLE;
CREATE OR REPLACE FUNCTION can_moderate_challenge(challenge_uuid UUID) RETURNS BOOLEAN AS $$ SELECT is_admin() OR is_challenge_organiser(challenge_uuid); $$ LANGUAGE sql SECURITY DEFINER STABLE;
CREATE OR REPLACE FUNCTION can_govern_challenge(challenge_uuid UUID) RETURNS BOOLEAN AS $$ SELECT is_admin() OR is_challenge_primary_organiser(challenge_uuid); $$ LANGUAGE sql SECURITY DEFINER STABLE;
CREATE OR REPLACE FUNCTION owns_challenge(challenge_uuid UUID) RETURNS BOOLEAN AS $$ SELECT can_govern_challenge(challenge_uuid); $$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile fields" ON public.profiles;
CREATE POLICY "Users can update own profile fields" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (is_admin());

-- Challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published challenges viewable by everyone" ON public.challenges;
CREATE POLICY "Published challenges viewable by everyone" ON public.challenges FOR SELECT USING (status IN ('upcoming', 'active', 'completed', 'archived'));
DROP POLICY IF EXISTS "Draft challenges viewable by organiser and admin" ON public.challenges;
CREATE POLICY "Draft challenges viewable by organiser and admin" ON public.challenges FOR SELECT USING (primary_organiser_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "Organisers and admins can create challenges" ON public.challenges;
CREATE POLICY "Organisers and admins can create challenges" ON public.challenges FOR INSERT WITH CHECK (is_organiser() AND (primary_organiser_id IS NULL OR primary_organiser_id = auth.uid()));
DROP POLICY IF EXISTS "Primary organiser and admins can update challenges" ON public.challenges;
CREATE POLICY "Primary organiser and admins can update challenges" ON public.challenges FOR UPDATE USING (primary_organiser_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "Primary organiser and admins can delete challenges" ON public.challenges;
CREATE POLICY "Primary organiser and admins can delete challenges" ON public.challenges FOR DELETE USING (primary_organiser_id = auth.uid() OR is_admin());

-- Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Approved projects are public" ON public.projects;
CREATE POLICY "Approved projects are public" ON public.projects FOR SELECT USING (status = 'approved' OR EXISTS (SELECT 1 FROM public.project_authors WHERE project_id = projects.id AND user_id = auth.uid()) OR is_admin());
DROP POLICY IF EXISTS "Users can create standalone projects" ON public.projects;
CREATE POLICY "Users can create standalone projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND challenge_id IS NULL);
DROP POLICY IF EXISTS "Participants can submit to challenges" ON public.projects;
CREATE POLICY "Participants can submit to challenges" ON public.projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND (challenge_id IS NULL OR is_participant()));
DROP POLICY IF EXISTS "Authors can update own pending projects" ON public.projects;
CREATE POLICY "Authors can update own pending projects" ON public.projects FOR UPDATE USING (status = 'pending' AND EXISTS (SELECT 1 FROM public.project_authors WHERE project_id = projects.id AND user_id = auth.uid() AND role = 'author'));
DROP POLICY IF EXISTS "Challenge organisers and admins can moderate projects" ON public.projects;
CREATE POLICY "Challenge organisers and admins can moderate projects" ON public.projects FOR UPDATE USING (is_admin() OR EXISTS (SELECT 1 FROM public.challenge_participants cp WHERE cp.challenge_id = projects.challenge_id AND cp.user_id = auth.uid() AND cp.role = 'organiser'));

-- Project authors
ALTER TABLE public.project_authors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Project authors are public" ON public.project_authors;
CREATE POLICY "Project authors are public" ON public.project_authors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authors can manage co-authors on own pending projects" ON public.project_authors;
CREATE POLICY "Authors can manage co-authors on own pending projects" ON public.project_authors FOR ALL USING (EXISTS (SELECT 1 FROM public.projects p JOIN public.project_authors pa ON pa.project_id = p.id WHERE p.id = project_authors.project_id AND pa.user_id = auth.uid() AND pa.role = 'author' AND p.status = 'pending'));

-- Challenge participants
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Participants are viewable by everyone" ON public.challenge_participants;
CREATE POLICY "Participants are viewable by everyone" ON public.challenge_participants FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can join public challenges" ON public.challenge_participants;
CREATE POLICY "Users can join public challenges" ON public.challenge_participants FOR INSERT WITH CHECK (user_id = auth.uid() AND role = 'participant' AND EXISTS (SELECT 1 FROM public.challenges WHERE id = challenge_id AND status IN ('upcoming', 'active') AND registration_mode = 'public'));
DROP POLICY IF EXISTS "Primary organiser and admins can add participants" ON public.challenge_participants;
CREATE POLICY "Primary organiser and admins can add participants" ON public.challenge_participants FOR INSERT WITH CHECK (can_govern_challenge(challenge_id));
DROP POLICY IF EXISTS "Primary organiser and admins can remove participants" ON public.challenge_participants;
CREATE POLICY "Primary organiser and admins can remove participants" ON public.challenge_participants FOR DELETE USING (can_govern_challenge(challenge_id) OR user_id = auth.uid());
DROP POLICY IF EXISTS "Primary organiser and admins can update participants" ON public.challenge_participants;
CREATE POLICY "Primary organiser and admins can update participants" ON public.challenge_participants FOR UPDATE USING (can_govern_challenge(challenge_id)) WITH CHECK (can_govern_challenge(challenge_id));

-- Organiser applications
ALTER TABLE public.organiser_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Applicants can view own applications" ON public.organiser_applications;
CREATE POLICY "Applicants can view own applications" ON public.organiser_applications FOR SELECT USING (applicant_id = auth.uid());
DROP POLICY IF EXISTS "Admins can view all applications" ON public.organiser_applications;
CREATE POLICY "Admins can view all applications" ON public.organiser_applications FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Users can apply to become organiser" ON public.organiser_applications;
CREATE POLICY "Users can apply to become organiser" ON public.organiser_applications FOR INSERT WITH CHECK (applicant_id = auth.uid() AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND platform_role IN ('organiser', 'admin')) AND NOT EXISTS (SELECT 1 FROM public.organiser_applications WHERE applicant_id = auth.uid() AND status = 'pending') AND (SELECT created_at FROM public.profiles WHERE id = auth.uid()) < NOW() - INTERVAL '7 days');
DROP POLICY IF EXISTS "Applicants can withdraw own application" ON public.organiser_applications;
CREATE POLICY "Applicants can withdraw own application" ON public.organiser_applications FOR UPDATE USING (applicant_id = auth.uid() AND status = 'pending') WITH CHECK (status = 'withdrawn');
DROP POLICY IF EXISTS "Admins can review applications" ON public.organiser_applications;
CREATE POLICY "Admins can review applications" ON public.organiser_applications FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- Histories + audit
ALTER TABLE public.user_role_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only admins can view role history" ON public.user_role_history;
CREATE POLICY "Only admins can view role history" ON public.user_role_history FOR SELECT USING (is_admin());
ALTER TABLE public.challenge_organiser_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Challenge organisers can view organiser history" ON public.challenge_organiser_history;
CREATE POLICY "Challenge organisers can view organiser history" ON public.challenge_organiser_history FOR SELECT USING (is_challenge_organiser(challenge_id) OR is_admin());
DROP POLICY IF EXISTS "Primary organiser and admins can write organiser history" ON public.challenge_organiser_history;
CREATE POLICY "Primary organiser and admins can write organiser history" ON public.challenge_organiser_history FOR INSERT WITH CHECK (can_govern_challenge(challenge_id));
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only admins can view audit log" ON public.audit_log;
CREATE POLICY "Only admins can view audit log" ON public.audit_log FOR SELECT USING (is_admin());
