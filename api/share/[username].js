// /api/share/[username].js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
    const { username } = req.query;

    const supabase = createClient(
        "https://zwwxnssxjnujuhqjfkyc.supabase.co",
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, user_name, nome, titulo, foto")
        .eq("user_name", username)
        .single();

    if (error || !profile) {
        return res.status(404).send("Perfil não encontrado.");
    }

    const ogImageUrl = `${req.headers.origin}/api/share/og-image/${profile.user_name}`;

    const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <!-- OG META (PROFISSIONAL IGUAL LINKEDIN) -->
      <meta property="og:title" content="${profile.nome} (@${profile.user_name})" />
      <meta property="og:description" content="${profile.titulo || "Veja o perfil completo"}" />
      <meta property="og:image" content="${ogImageUrl}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content="${req.headers.origin}/user/${profile.user_name}" />
      <meta property="og:type" content="profile" />

      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${profile.nome} (@${profile.user_name})" />
      <meta name="twitter:description" content="${profile.titulo || ""}" />
      <meta name="twitter:image" content="${ogImageUrl}" />

      <title>${profile.nome}</title>
  </head>
  <body>
      Redirecionando...
      <script>
         window.location.href = "/user/${profile.user_name}";
      </script>
  </body>
  </html>
  `;

    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(html);
}
