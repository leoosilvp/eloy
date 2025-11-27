// /api/share/og-image/[username].js

import { ImageResponse } from "@vercel/og";
import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "nodejs18.x",  // <<< OBRIGATÓRIO PARA SUPORTAR SUPABASE E OG
};

export default async function handler(req, res) {
  const { username } = req.query;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_name, nome, titulo, foto")
    .eq("user_name", username)
    .single();

  if (!profile) {
    res.status(404).send("Perfil não encontrado.");
    return;
  }

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={profile.foto}
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "8px solid #fff",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          }}
        />

        <h1
          style={{
            fontSize: 50,
            marginTop: 30,
            color: "#111",
            fontWeight: "bold",
          }}
        >
          {profile.nome}
        </h1>

        <p
          style={{
            fontSize: 32,
            color: "#444",
            marginTop: 10,
          }}
        >
          {profile.titulo}
        </p>

        <p
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "#666",
          }}
        >
          @{profile.user_name}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );

  // **IMPORTANTE**: não usar Buffer no runtime Edge/Node moderno
  res.setHeader("Content-Type", "image/png");
  res.status(200).send(Buffer.from(await image.arrayBuffer()));
}
