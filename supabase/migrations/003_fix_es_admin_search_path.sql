create or replace function public.es_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'admin@azucena.com';
$$;
