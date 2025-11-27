import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zwwxnssxjnujuhqjfkyc.supabase.co";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

export default async function handler(req, res) {
  const { username } = req.query;

  // Detectar bots para OG tags funcionarem
  const ua = req.headers["user-agent"]?.toLowerCase() || "";
  const isBot = /(bot|crawler|spider|facebook|whatsapp|linkedin|twitter)/.test(ua);

  const { data: user, error } = await supabase
    .from("profiles")
    .select("user_name, nome, titulo, foto")
    .eq("user_name", username)
    .single();

  if (error || !user) {
    return res.status(404).send("<h1>Perfil não encontrado</h1>");
  }

  const TITLE = `${user.nome} — ${user.titulo || ""}`.trim();
  const FINAL_URL = `https://${req.headers.host}/user/${user.user_name}`;

  let IMAGE = user.foto || "";

  // Se for caminho relativo → tornar absoluto
  if (IMAGE && !IMAGE.startsWith("http")) {
    IMAGE = `https://${req.headers.host}${IMAGE}`;
  }

  // Se NÃO for bot → redirecionar normalmente
  if (!isBot) {
    return res.redirect(302, FINAL_URL);
  }

  // Se for bot → retornar metatags OG
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">

  <title>${TITLE}</title>

  <!-- Open Graph -->
  <meta property="og:title" content="${TITLE}">
  <meta property="og:description" content="Conheça o perfil de ${user.nome} no Eloy">
  <meta property="og:image" content="${IMAGE}">
  <meta property="og:url" content="${FINAL_URL}">
  <meta property="og:type" content="profile">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${TITLE}">
  <meta name="twitter:description" content="Conheça o perfil de ${user.nome} no Eloy">
  <meta name="twitter:image" content="${IMAGE}">
</head>

<body>
  Redirecionando para o perfil de ${user.nome}…
</body>
</html>
`;

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
