import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zwwxnssxjnujuhqjfkyc.supabase.co";
const ANON = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, ANON);

export default async function handler(req, res) {
  const { username } = req.query;

  // Busca o perfil
  const { data: user, error } = await supabase
    .from("profiles")
    .select("user_name, nome, titulo, foto")
    .eq("user_name", username)
    .single();

  if (error || !user) {
    return res.status(404).send("<h1>Perfil não encontrado</h1>");
  }

  const NAME = user.nome || "Sem Nome";
  const TITLE = user.titulo || "Sem Título";
  const IMAGE =
    user.foto ||
    "https://img.freepik.com/vetores-premium/icone-de-perfil.jpg";

  // URL final do perfil
  const FINAL_URL = `https://${req.headers.host}/user/${user.user_name}`;

  // HTML correto para bots e para humanos
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />

  <title>${NAME} — ${TITLE}</title>

  <!-- OG -->
  <meta property="og:title" content="${NAME} — ${TITLE}" />
  <meta property="og:description" content="Conheça o perfil de ${NAME} no Eloy" />
  <meta property="og:image" content="${IMAGE}" />
  <meta property="og:url" content="${FINAL_URL}" />
  <meta property="og:type" content="profile" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${NAME} — ${TITLE}">
  <meta name="twitter:description" content="Conheça o perfil de ${NAME} no Eloy">
  <meta name="twitter:image" content="${IMAGE}">

  <script>
    // Detecta BOT: eles NÃO devem ser redirecionados
    const isBot =
      /bot|crawl|spider|facebookexternalhit|WhatsApp|twitterbot/i.test(navigator.userAgent);

    // HUMANO → redirecionar automaticamente
    if (!isBot) {
      window.location.href = "${FINAL_URL}";
    }
  </script>
</head>

<body>
  <p>Redirecionando...</p>
</body>
</html>
`;

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
