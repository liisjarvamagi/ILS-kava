// Hommikukirjast loobumine ilma sisselogimiseta. Lingis on
// allkirjastatud ja aeguv token — võltsitud või aegunud token ei tee
// midagi. Loobumine lülitab ainult hommikukirja linnukese välja,
// kontot ega kava see ei puuduta.
import { verifyUnsubscribe, serviceClient } from '../../../lib/emailDaily';

function page(title, body) {
  return new Response(
    `<!doctype html><html lang="et"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>body{font-family:sans-serif;background:#080b14;color:#e8ecf5;
display:flex;align-items:center;justify-content:center;min-height:100vh;
margin:0;padding:20px;text-align:center}div{max-width:420px}
h1{font-size:20px}p{color:#9aa2c0;line-height:1.6}
a{color:#e8c264;font-weight:700}</style></head>
<body><div><h1>${title}</h1><p>${body}</p></div></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

export async function GET(request) {
  const token = new URL(request.url).searchParams.get('token');
  const ok = verifyUnsubscribe(token);
  if (!ok) {
    return page('Link ei kehti',
      'See loobumislink on aegunud või vigane. Saad hommikukirja välja lülitada ka äpi profiililehelt.');
  }
  const supabase = serviceClient();
  if (!supabase) return page('Viga', 'Server on seadistamata.');

  // Loobumine on sündmusepõhine: kustub AINULT selle sündmuse
  // tellimus, teiste festivalide kirjad jäävad alles
  await supabase.from('event_email_prefs')
    .delete()
    .eq('user_id', ok.userId)
    .eq('event_id', ok.eventId);

  return page('Selle sündmuse hommikukirjad on välja lülitatud ✅',
    'Rohkem selle sündmuse kirju ei tule. Kui mõtled ümber, saad need äpi profiililehelt uuesti sisse lülitada.');
}
