// /api/share/og-image/[username].js
import { ImageResponse } from "@vercel/og";
import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const username = req.nextUrl.pathname.split("/").pop();

  const supabase = createClient(
    "https://zwwxnssxjnujuhqjfkyc.supabase.co",
        process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_name, nome, titulo, foto")
    .eq("user_name", username)
    .single();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        {/* FOTO */}
        <img
          src={profile.foto}
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "8px solid white",
            boxShadow: "0 4px 25px rgba(0,0,0,0.15)",
          }}
        />

        {/* NOME */}
        <h1
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            marginTop: "25px",
            color: "#222",
          }}
        >
          {profile.nome}
        </h1>

        {/* HEADLINE */}
        <p
          style={{
            marginTop: "10px",
            fontSize: "32px",
            color: "#444",
            maxWidth: "800px",
            textAlign: "center",
          }}
        >
          {profile.titulo}
        </p>

        {/* USERNAME */}
        <p
          style={{
            marginTop: "20px",
            fontSize: "28px",
            color: "#666",
          }}
        >
          @{profile.user_name}
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
