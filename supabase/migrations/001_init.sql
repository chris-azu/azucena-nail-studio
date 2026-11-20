create extension if not exists pgcrypto;

create table if not exists public.tipos_unia (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.fotos (
  id uuid primary key default gen_random_uuid(),
  nombre text,
  url text not null,
  storage_path text,
  created_at timestamptz not null default now()
);

create unique index if not exists fotos_url_key on public.fotos (url);

alter table public.tipos_unia enable row level security;
alter table public.fotos enable row level security;

drop policy if exists "tipos_select_publico" on public.tipos_unia;
create policy "tipos_select_publico" on public.tipos_unia for select to anon, authenticated using (true);
drop policy if exists "tipos_insert_admin" on public.tipos_unia;
create policy "tipos_insert_admin" on public.tipos_unia for insert to authenticated with check (true);
drop policy if exists "tipos_update_admin" on public.tipos_unia;
create policy "tipos_update_admin" on public.tipos_unia for update to authenticated using (true) with check (true);
drop policy if exists "tipos_delete_admin" on public.tipos_unia;
create policy "tipos_delete_admin" on public.tipos_unia for delete to authenticated using (true);

drop policy if exists "fotos_select_publico" on public.fotos;
create policy "fotos_select_publico" on public.fotos for select to anon, authenticated using (true);
drop policy if exists "fotos_insert_admin" on public.fotos;
create policy "fotos_insert_admin" on public.fotos for insert to authenticated with check (true);
drop policy if exists "fotos_update_admin" on public.fotos;
create policy "fotos_update_admin" on public.fotos for update to authenticated using (true) with check (true);
drop policy if exists "fotos_delete_admin" on public.fotos;
create policy "fotos_delete_admin" on public.fotos for delete to authenticated using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-galeria', 'fotos-galeria', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fotos_bucket_insert_admin" on storage.objects;
create policy "fotos_bucket_insert_admin" on storage.objects for insert to authenticated with check (bucket_id = 'fotos-galeria');
drop policy if exists "fotos_bucket_update_admin" on storage.objects;
create policy "fotos_bucket_update_admin" on storage.objects for update to authenticated using (bucket_id = 'fotos-galeria') with check (bucket_id = 'fotos-galeria');
drop policy if exists "fotos_bucket_delete_admin" on storage.objects;
create policy "fotos_bucket_delete_admin" on storage.objects for delete to authenticated using (bucket_id = 'fotos-galeria');

insert into public.tipos_unia (nombre) values
  ('Esmalte'),
  ('Poli gel'),
  ('Acrílico'),
  ('Gel & Kapping'),
  ('Semipermanente'),
  ('Nail art')
on conflict (nombre) do nothing;

insert into public.fotos (nombre, url) values
  ('Set Flores Silvestres', 'https://lh3.googleusercontent.com/aida-public/AB6AXuADKn6hJKGxF1_VVgaFncA-gus8mHbO0vEAS4ApkEvAO33Yu_2Noi5HocP-N-jzdpVuTJzLDLlD8PcnyAeBBalIMfxBmJBEHF_2anuvr2x1BUnt9_pWyUGxOe0c_RYn-xAGQKnnaSvxMBBhkz5nCH_gxFzvXB342zlLpVgjO0FsBcXkjNkdBFV1DonRi-kYGwTTgVXWhycmuicnVyh4MAzBVW04ndzRUukFjA3imbBst2TJY5KjCPmVwg'),
  ('Puntas Glazed', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmm-xTceUebb0cCVjkV-331D_OzhG-g5ETUmANypBDT9np-Wek_tsaFUrky4FqH2ia__hqcCtVpVm_6WRKzmWBgel2rw3jUFs0nlb_3kB7lWWUStgdld8oWLX9V9xfyErcMiOPNJOU6hp696u5upiDolUhSD69ni1AbbWXcrzpY8ANb8KhlxikOAyAyE8ZVfOW5rkpYC4-AmRagBeadLjvNcOW5BPwx3e34N7ZljZyC3JTQ88ZLixAEQ'),
  ('Efecto Cuarzo Rosa', 'https://lh3.googleusercontent.com/aida-public/AB6AXuArbdmFZOfrV-VaJ3q_Y1n_T9vgSmT1TcBHovyEr1rPbdw-_e4vncWBnONq3GPISzqjpZnS60zfyxzgq6sj9-lRuO-zMD_2mMARU8tXIgURUfhjolCG0gxDizz46JcNMNyPH3UIqj0-Y-rpnlLglJMYhLfh0GerQ3h0-LpFa8VlSmKAeF8lb0Ptl_V5_yKZChyr1ppJRUt7JLJ47-dGcFSelvvZWf49Z9VqQmHHfxiKTnRcMTEi30yMXA'),
  ('Línea Minimal Gold', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrpTirn4_-wjz9i40DB8nIRfYf6J2zUhz6SenruXzxscn4rEPcvMKL1g9j6QO06-wnZpLCKZD5Ahv7o0Nf42PUpQdesm5RyRFTNZCSaAKPDVXVxXq_Q_g1_fvpledNalOQmYL6TVW58dfx16TPD0eKcPb4-hZHkcIPX_iVkqhvIG-MqHP_4YS2_TKoDBBsl7y3_5D2hkjYKhdITfEiOO9Y8EEy4PI_TaW5Ob_nMV73COmDJHrRq7H6gw'),
  ('French Invertido', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8iWc53Euwt6oXq-qlZ_n7_qBCtLIf7rKSxYxJ9XfUj2V-y3Ep9ifv_S2E8v4DOehPWnhLllkFb83lve8oj2sEBgCAPv3vKbEa0uAKym7jd9zdOWDOKiQjQWv4noUeNqndldfGgpAjUF8TF4AUZbxbDW988mPAQ4eVEoKNLQ9HpcK51Fe508_ZsHCe-XhojucbmyN2dse8iLhzNTfxoiBIhdXYr00FAtF13dri8g6OAm8wjmHJEYSr8w'),
  ('Hojas & Flores Secas', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_sdhkoh5AbVUgJB96NOewIYn201jUdeg1AkLRmr30bRsAc1S-L5uW0RLOvgSc0oQ_8Hp8y86DQrDMl4RbLf7MVASKfaCkYLYFLomT_TFwWZIbN5qw5XZscMR9MZ6uyQoX-sl9r2wJG4Bbsr9Sy2AsNNunwGvkTbfgc4OdDnuQNhwiK54f8HSZHJ-cSMNHerNwAG65bOaQmAQ0o2h9b5F7Y0DIwlzPfeu9YAK1yFskTb-wYY5vCAs99g'),
  ('Estructura Almendrada', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaSaoQu1ztxE9lWjOfgpblzwHdEvukXL8BWV7zMB3Od1BI7wXepJVcIRkUl8Fgt6Nx21ORpIEVxUVSFU4NJHT0nHJr_nIXxK7Csd52I_vGif9pKAQQio6zGPmMrl98NX3JlBDGKHv6bUKkmJQJMvVc4OiUzOsJtvEqmD1QejYRgexeugOJOGTW749T5BsjOeIqEKh07yI6ncS6kZEvptw3taA1dFBUmYwNqyEF_ETOePwvjhtXAIS8fg'),
  ('Baby Boomer Rosé', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZLGTCZwjWbyqr7F2Zv9H1zMORcyQUOeQpOEdEQ2UTNOBoCoJCvUacJ26vTkWKDTkuEGNFMH97FucCs12dv3JALnx1PDPqyLGW7RlbryxSaO4XKU1lwC77kKGluRk6J_XoTYUsPSKdVZfOgiXvymGbnT86HVD2zo-ymu9hQ-S8a3ovxw-V3WF23ckKBbYd7UWtI7i0kRof4MaB-O2v9tw4VPJekS2CkH5_4m6klWCRwjJtV8SRFVpaFQ'),
  ('Glazed Donut Effect', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNV_-YoHcHTYrRmazgVJ6NH15xBu_M1fIvS08G4vwqBPiKMc_xDk7UVzD5crwA9CZhwvqlYZuPs1p33Fc92qc4KeJ2ex8L6iw0QdUaK6Lltmt_MGeF2L_4u7mkg9xkUsgonagriFKuRBkq38ZsqEVepDrjhZkv7RJQj0yRMqEpiX5Hfx_8GsUKmn0h_Tbn9VOm_8d3kodecZ8vBp3uNZa7edFehH9gkfe4MtnWFlPUNcS-f3jExC4lTA'),
  ('Micro Floral Botánico', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTLCTS2M8SqXA910iburDZWg5bn9feK0ahiNHVYvctEeaaQnL5exOhACpeq89Ox47xQmuJbzHy4p9IDH4PH0e9FVlpktM6_d6RjwqYNAKb88Rk4P0pr4QjcXMUNwWBRfZAXJG_VB_8-kPk6As2I5pJwya8brOzijAT1rohNd35z915lm1HVlvkzAo43GnxqZGLpOXJKRxCbaRSPjPl8AA-87bSf3SsA9lZYNNKs651XwbWmltMcp2U0Q')
on conflict (url) do nothing;
