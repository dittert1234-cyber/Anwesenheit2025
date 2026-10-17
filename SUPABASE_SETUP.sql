-- Einmalige Einrichtung/Ergänzung für die Anwesenheits-App.
-- Voraussetzung: Tabellen app_profiles, course_participants, attendance_days
-- sowie app_is_approved() und app_is_admin() wurden bereits angelegt.

alter table public.app_profiles enable row level security;
alter table public.course_participants enable row level security;
alter table public.attendance_days enable row level security;

-- Freigegebene Nutzer dürfen alle Teilnehmer und Anwesenheitstage lesen/bearbeiten.
drop policy if exists "approved users manage participants" on public.course_participants;
create policy "approved users manage participants"
on public.course_participants for all to authenticated
using (public.app_is_approved()) with check (public.app_is_approved());

drop policy if exists "approved users manage attendance" on public.attendance_days;
create policy "approved users manage attendance"
on public.attendance_days for all to authenticated
using (public.app_is_approved()) with check (public.app_is_approved());

-- Benutzer sehen ihr eigenes Profil; freigegebene Nutzer sehen Profile für die Verwaltung.
drop policy if exists "profiles read" on public.app_profiles;
drop policy if exists "users read own profile" on public.app_profiles;
drop policy if exists "admins read all profiles" on public.app_profiles;
create policy "profiles read"
on public.app_profiles for select to authenticated
using (user_id = (select auth.uid()) or public.app_is_approved());

-- Keine Profiländerungen über das Browser-Frontend zulassen.
-- Freigaben/Rollen werden im Supabase Table Editor durch den Projektadmin gesetzt.
revoke insert, update, delete on public.app_profiles from authenticated;
grant select on public.app_profiles to authenticated;
grant select, insert, update, delete on public.course_participants to authenticated;
grant select, insert, update, delete on public.attendance_days to authenticated;

grant execute on function public.app_is_approved() to authenticated;
grant execute on function public.app_is_admin() to authenticated;

-- ADMIN ERSTMALS EINRICHTEN:
-- 1) Konto zuerst über die App registrieren und ggf. E-Mail bestätigen.
-- 2) Die folgende Abfrage separat ausführen, E-Mail ersetzen:
-- insert into public.app_profiles (user_id, display_name, role, approved)
-- select id, coalesce(raw_user_meta_data ->> 'full_name', email), 'admin', true
-- from auth.users where lower(email)=lower('DEINE-E-MAIL@example.com')
-- on conflict (user_id) do update set role='admin', approved=true;
