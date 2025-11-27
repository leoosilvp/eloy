import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zwwxnssxjnujuhqjfkyc.supabase.co"; // mesma URL que você usa hoje
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY; // 🔐 seguro no server!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

export default async function handler(req, res) {
  const { username } = req.query;

  // Buscar dados do perfil
  const { data: user, error } = await supabase
    .from("profiles")
    .select("user_name, nome, titulo, resumo, foto, banner")
    .eq("user_name", username)
    .single();

  if (error || !user) {
    return res.status(404).send("<h1>Perfil não encontrado</h1>");
  }

  const title = `${user.nome} — ${user.titulo || "Perfil no Eloy"}`;
  const description = user.resumo || "Confira este perfil profissional no Eloy.";
  const image = user.banner || user.foto;

  const finalUrl = `${req.headers.host}/user/${user.user_name}`;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>

  <title>${title}</title>

  <!-- Open Graph -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="https://${finalUrl}" />
  <meta property="og:type" content="profile" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />

</head>
<body>
  <script>
    window.location.href = "/user/${user.user_name}";
  </script>
  <noscript>Redirecionando…</noscript>
</body>
</html>
`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
