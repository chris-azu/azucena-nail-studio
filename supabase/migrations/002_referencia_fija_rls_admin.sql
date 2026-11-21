alter table public.tipos_unia add column if not exists es_fijo boolean not null default false;

create unique index if not exists tipos_unia_fijo_unico
  on public.tipos_unia ((es_fijo)) where es_fijo;

insert into public.tipos_unia (nombre, es_fijo)
values ('Enviar referencia', true)
on conflict (nombre) do update set es_fijo = true;

create or replace function public.es_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'admin@azucena.com';
$$;

revoke all on function public.es_admin() from anon;
grant execute on function public.es_admin() to authenticated;

drop policy if exists "tipos_insert_admin" on public.tipos_unia;
create policy "tipos_insert_admin" on public.tipos_unia for insert to authenticated
  with check (public.es_admin() and es_fijo = false);

drop policy if exists "tipos_update_admin" on public.tipos_unia;
create policy "tipos_update_admin" on public.tipos_unia for update to authenticated
  using (public.es_admin() and es_fijo = false)
  with check (public.es_admin() and es_fijo = false);

drop policy if exists "tipos_delete_admin" on public.tipos_unia;
create policy "tipos_delete_admin" on public.tipos_unia for delete to authenticated
  using (public.es_admin() and es_fijo = false);

drop policy if exists "fotos_insert_admin" on public.fotos;
create policy "fotos_insert_admin" on public.fotos for insert to authenticated
  with check (public.es_admin());

drop policy if exists "fotos_update_admin" on public.fotos;
create policy "fotos_update_admin" on public.fotos for update to authenticated
  using (public.es_admin())
  with check (public.es_admin());

drop policy if exists "fotos_delete_admin" on public.fotos;
create policy "fotos_delete_admin" on public.fotos for delete to authenticated
  using (public.es_admin());

drop policy if exists "fotos_bucket_insert_admin" on storage.objects;
create policy "fotos_bucket_insert_admin" on storage.objects for insert to authenticated
  with check (public.es_admin() and bucket_id = 'fotos-galeria');

drop policy if exists "fotos_bucket_update_admin" on storage.objects;
create policy "fotos_bucket_update_admin" on storage.objects for update to authenticated
  using (public.es_admin() and bucket_id = 'fotos-galeria')
  with check (public.es_admin() and bucket_id = 'fotos-galeria');

drop policy if exists "fotos_bucket_delete_admin" on storage.objects;
create policy "fotos_bucket_delete_admin" on storage.objects for delete to authenticated
  using (public.es_admin() and bucket_id = 'fotos-galeria');
