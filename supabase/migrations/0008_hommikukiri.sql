-- ============================================================
-- 0008: HOMMIKUKIRI
-- Käivita Supabase SQL Editoris PÄRAST 0007 faili.
-- Annab adminitele õiguse meilimalle lugeda ja muuta (Meilid sakk)
-- ning lisab hommikukirja vaikimisi malli. Kirja saatmine käib
-- serveris (Verceli cron + Resend), mitte siit.
-- ============================================================

create policy "admin read templates" on email_templates
  for select using (is_admin());
create policy "admin write templates" on email_templates
  for all using (is_admin()) with check (is_admin());

insert into email_templates (key, subject_et, subject_en, body_et, body_en)
values (
  'daily_schedule',
  'Sinu tänane I Land Soundi kava 🌅',
  'Your I Land Sound picks for today 🌅',
  '<p>Tere, {{nimi}}!</p>
<p>Siin on Sinu tänased valikud:</p>
{{kava}}
<p>Ilusat festivalipäeva!</p>
<p style="font-size:12px;color:#888">Kui Sa ei soovi hommikukirju,
<a href="{{loobu_link}}">vajuta siia</a>.</p>',
  '<p>Hi {{nimi}}!</p>
<p>Here are your picks for today:</p>
{{kava}}
<p>Have a great festival day!</p>
<p style="font-size:12px;color:#888">If you don''t want these emails,
<a href="{{loobu_link}}">click here</a>.</p>'
)
on conflict (key) do nothing;
