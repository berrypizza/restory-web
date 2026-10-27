-- Runs entirely inside a rolled-back transaction: no members or posts are retained.
begin;
insert into auth.users(id,aud,role,email,raw_app_meta_data,raw_user_meta_data)
values ('a1010000-0000-4000-8000-000000000001','authenticated','authenticated','community-test-a@example.invalid','{}','{}'),
       ('a1010000-0000-4000-8000-000000000002','authenticated','authenticated','community-test-b@example.invalid','{}','{}'),
       ('a1010000-0000-4000-8000-000000000003','authenticated','authenticated','community-test-m@example.invalid','{}','{}');
insert into public.community_moderators(user_id) values ('a1010000-0000-4000-8000-000000000003');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"a1010000-0000-4000-8000-000000000001","role":"authenticated"}',true);
insert into public.community_profiles(id,nickname) values (auth.uid(),'검증회원가');
do $$ declare post_id uuid; begin
  insert into public.community_posts(category,title,body,image_paths)
  values ('question','권한 테스트 게시글','이 글은 권한 검증을 위한 임시 데이터이며 트랜잭션 종료 후 사라집니다.',array[auth.uid()::text || '/a1010000-0000-4000-8000-000000000004.jpg']) returning id into post_id;
  perform set_config('community.test_post',post_id::text,true);
  insert into public.community_comments(post_id,body) values(post_id,'확인된 경험을 나누는 댓글 테스트입니다.');
end $$;
select set_config('request.jwt.claims','{"sub":"a1010000-0000-4000-8000-000000000002","role":"authenticated"}',true);
insert into public.community_profiles(id,nickname) values (auth.uid(),'검증회원나');
do $$ declare changed integer; blocked boolean := false; begin
  update public.community_posts set title='타인이 바꾸는 제목' where id=current_setting('community.test_post')::uuid;
  get diagnostics changed=row_count;
  if changed <> 0 then raise exception 'FAIL other member edited post'; end if;
  begin insert into public.community_moderators(user_id) values(auth.uid()); exception when insufficient_privilege then blocked:=true; end;
  if not blocked then raise exception 'FAIL self escalation'; end if;
  blocked:=false;
  begin insert into public.community_posts(author_id,category,title,body) values('a1010000-0000-4000-8000-000000000001','chat','사칭 테스트 제목','타인의 작성자 아이디를 넣을 수 없어야 하며 이 요청은 거절되어야 합니다.'); exception when insufficient_privilege then blocked:=true; end;
  if not blocked then raise exception 'FAIL spoofed author'; end if;
  insert into public.community_reports(post_id,reason,note) values(current_setting('community.test_post')::uuid,'privacy','테스트 신고입니다.');
end $$;
set local role anon;
select set_config('request.jwt.claims','{}',true);
do $$ declare blocked boolean:=false; begin
  if not exists(select 1 from public.community_posts where id=current_setting('community.test_post')::uuid) then raise exception 'FAIL anonymous public read'; end if;
  if not exists(select 1 from public.community_comments where post_id=current_setting('community.test_post')::uuid) then raise exception 'FAIL anonymous comment read'; end if;
  begin insert into public.community_posts(category,title,body) values('chat','비회원 글쓰기 테스트','로그인하지 않은 방문자가 글을 등록할 수 없어야 합니다.'); exception when insufficient_privilege then blocked:=true; end;
  if not blocked then raise exception 'FAIL anonymous write'; end if;
  blocked:=false;
  begin perform count(*) from public.community_reports; exception when insufficient_privilege then blocked:=true; end;
  if not blocked then raise exception 'FAIL anonymous report access'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"a1010000-0000-4000-8000-000000000003","role":"authenticated"}',true);
do $$ begin
  if not exists(select 1 from public.community_reports where post_id=current_setting('community.test_post')::uuid) then raise exception 'FAIL moderator report access'; end if;
  update public.community_posts set status='hidden',title='운영자 내용 변경 시도' where id=current_setting('community.test_post')::uuid;
  if not exists(select 1 from public.community_posts where id=current_setting('community.test_post')::uuid and status='hidden' and title='권한 테스트 게시글') then raise exception 'FAIL moderation preserve content'; end if;
end $$;
set local role anon;
select set_config('request.jwt.claims','{}',true);
do $$ begin
  if exists(select 1 from public.community_posts where id=current_setting('community.test_post')::uuid) then raise exception 'FAIL hidden post public'; end if;
  if exists(select 1 from public.community_comments where post_id=current_setting('community.test_post')::uuid) then raise exception 'FAIL hidden post comments public'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"a1010000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$ declare changed integer; blocked boolean:=false; i integer; begin
  update public.community_posts set status='published' where id=current_setting('community.test_post')::uuid;
  get diagnostics changed=row_count;
  if changed<>0 then raise exception 'FAIL author unhides moderated post'; end if;
  for i in 1..4 loop
    insert into public.community_posts(category,title,body) values('chat','반복 등록 제한 확인','이 내용은 반복 등록 제한을 확인하는 임시 데이터입니다.');
  end loop;
  begin insert into public.community_posts(category,title,body) values('chat','여섯 번째 등록 확인','십 분 안에 여섯 개의 글을 작성하면 등록을 거절해야 합니다.');
  exception when raise_exception then if sqlerrm='community_rate_limit' then blocked:=true; else raise; end if; end;
  if not blocked then raise exception 'FAIL posting rate limit'; end if;
end $$;
reset role;
rollback;
select json_build_object('passed',13,'transaction','rolled_back','checks',array['member post/comment write','other author denied','self promotion denied','author spoofing denied','anonymous read','anonymous write denied','report private','moderator reports','moderator hides without rewriting','hidden post not public','hidden comments not public','author cannot unhide','posting rate limit']) as community_verification;
