create or replace function public.community_get_likes(post_ids uuid[])
returns table(post_id uuid, like_count bigint, liked boolean)
language plpgsql stable security invoker set search_path = '' as $$
begin
  return query select * from community_private.like_summary(post_ids);
end;
$$;
revoke all on function public.community_get_likes(uuid[]) from public, anon, authenticated;
grant execute on function public.community_get_likes(uuid[]) to anon, authenticated;
