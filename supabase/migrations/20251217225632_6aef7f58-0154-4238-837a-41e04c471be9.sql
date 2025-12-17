-- Grant admin role to contato@petserpentes.com.br (id: 243c017d-02c9-4b50-89d4-8389f69a968e)
insert into public.user_roles (user_id, role)
select '243c017d-02c9-4b50-89d4-8389f69a968e'::uuid, 'admin'::public.app_role
where not exists (
  select 1 from public.user_roles
  where user_id = '243c017d-02c9-4b50-89d4-8389f69a968e'::uuid
    and role = 'admin'::public.app_role
);
