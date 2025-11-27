import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zwwxnssxjnujuhqjfkyc.supabase.co";

export default async function handler(req, res) {
  const { user_name } = req.query;

  // Pega Service Role da variável de ambiente da Vercel
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).send("ERRO: SUPABASE_SERVICE_ROLE_KEY não encontrada.");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: user, error } = await supabase
    .from("profiles")
    .select("user_name, nome, titulo, foto")
    .eq("user_name", user_name)
    .single();

  if (error || !user) {
    return res.status(404).send("<h1>Perfil não encontrado</h1>");
  }

  const NAME = user.nome || "Sem Nome";
  const TITLE = user.titulo || "Sem Título";
  const IMAGE =
    user.foto ||
    "https://img.freepik.com/vetores-premium/icone-de-perfil-de-avatar-padrao-imagem-de-usuario-de-midia-social-icone-de-avatar-cinza-silhueta-de-perfil-em-branco-ilustracao-vetorial_561158-3407.jpg";

  const FINAL_URL = `https://${req.headers.host}/user/${user.user_name}`;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />

  <title>${NAME} — ${TITLE}</title>

  <!-- OPEN GRAPH -->
  <meta property="og:title" content="${NAME} — ${TITLE}" />
  <meta property="og:description" content="Conheça o perfil de ${NAME} no Eloy" />
  <meta property="og:image" content="${IMAGE}" />
  <meta property="og:url" content="${FINAL_URL}" />
  <meta property="og:type" content="profile" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- TWITTER -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${NAME} — ${TITLE}" />
  <meta name="twitter:description" content="Conheça o perfil de ${NAME} no Eloy" />
  <meta name="twitter:image" content="${IMAGE}" />

  <!-- REDIRECT -->
  <meta http-equiv="refresh" content="0; url=${FINAL_URL}" />
</head>

<body>
  <p>Redirecionando para o perfil de ${NAME}…</p>
</body>
</html>
`;

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
