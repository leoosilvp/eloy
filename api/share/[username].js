import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zwwxnssxjnujuhqjfkyc.supabase.co";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

export default async function handler(req, res) {
  const { username } = req.query;

  const { data: user, error } = await supabase
    .from("profiles")
    .select("user_name, nome, titulo, foto")
    .eq("user_name", username)
    .single();

  if (error || !user) {
    return res.status(404).send("<h1>Perfil não encontrado</h1>");
  }

  const NAME = user.nome;
  const TITLE = user.titulo || "";
  const IMAGE = user.foto || "https://via.placeholder.com/600x400?text=Eloy";

  // URL FINAL do perfil
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

  <!-- REDIRECIONAMENTO -->
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
