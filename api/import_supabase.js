// import_supabase.js
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY como variáveis de ambiente.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// path do seu JSON
const usersJsonPath = "/db/users.json";

async function main() {
  const raw = fs.readFileSync(usersJsonPath, "utf8");
  const users = JSON.parse(raw);

  // 1) Criar todos os usuários no auth (primeiro passo) e armazenar mapping custom_id -> uuid
  const mapping = {}; // { custom_id: uuid }

  console.log("Criando contas em auth.users...");
  for (const u of users) {
    // cria usuário no auth (admin)
    // OBS: createUser é admin endpoint. Suporta password e email.
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.senha,
      user_metadata: { custom_id: u.id, nome: u.nome }
    });

    if (createErr) {
      console.error("Erro criando auth user para", u.email, createErr);
      // se já existir usuário com esse email, tentar buscar id
      const { data: existing } = await supabase.auth.admin.listUsers({ search: u.email }).catch(() => ({ data: null }));
      if (existing && existing.length) {
        mapping[u.id] = existing[0].id;
        console.log("Usando usuário existente:", u.email);
      } else {
        continue;
      }
    } else {
      mapping[u.id] = created.id;
      console.log("Criado:", u.email, "->", created.id);
    }
  }

  // 2) Inserir profiles e tabelas filhas
  console.log("Inserindo profiles e dados relacionados...");
  for (const u of users) {
    const userUuid = mapping[u.id];
    if (!userUuid) {
      console.warn("Pular import de", u.id, "- sem uuid");
      continue;
    }

    // profile
    const profile = {
      id: userUuid,
      custom_id: u.id,
      nome: u.nome,
      genero: u.genero,
      foto: u.foto,
      banner: u.banner,
      titulo: u.titulo,
      cargo: u.cargo,
      empresa: u.empresa,
      resumo: u.resumo,
      estado: u.estado,
      pais: u.pais,
      area: u.area,
      aniversario: u.aniversario
    };

    const { error: pErr } = await supabase.from("profiles").upsert(profile);
    if (pErr) console.error("Erro inserindo profile", u.id, pErr);

    // competencias
    for (const comp of u.competencias || []) {
      await supabase.from("competencias").insert({ user_id: userUuid, competencia: comp }).catch(e=>console.error("comp error", e));
    }

    // experiencias
    for (const exp of u.experiencias || []) {
      // ignorar experiências vazias
      if (!Object.values(exp).some(v => v && v.toString().trim().length)) continue;
      await supabase.from("experiencias").insert({
        user_id: userUuid,
        empresa: exp.empresa || null,
        tipo: exp.tipo || null,
        cargo: exp.cargo || null,
        inicio: exp.inicio || null,
        fim: exp.fim || null,
        local: exp.local || null,
        descricao: exp.descricao || null
      }).catch(e=>console.error("exp error", e));
    }

    // formacao
    for (const f of u.formacao || []) {
      await supabase.from("formacao").insert({
        user_id: userUuid,
        curso: f.curso,
        instituicao: f.instituicao,
        ano: f.ano
      }).catch(e=>console.error("form error", e));
    }

    // projetos
    for (const p of u.projetos || []) {
      await supabase.from("projetos").insert({
        user_id: userUuid,
        titulo: p.titulo,
        link: p.link,
        descricao: p.descricao
      }).catch(e=>console.error("proj error", e));
    }

    // certificacoes
    for (const c of u.certificacoes || []) {
      await supabase.from("certificacoes").insert({
        user_id: userUuid,
        curso: c.curso,
        instituicao: c.instituicao,
        duracao: c.duracao
      }).catch(e=>console.error("cert error", e));
    }

    // idiomas
    for (const il of u.idiomas || []) {
      await supabase.from("idiomas").insert({
        user_id: userUuid,
        idioma: il.idioma,
        nivel: il.nivel
      }).catch(e=>console.error("idi error", e));
    }

    // interesses
    for (const it of u.areainteresses || []) {
      await supabase.from("interesses").insert({
        user_id: userUuid,
        interesse: it
      }).catch(e=>console.error("int error", e));
    }

    // posts
    for (const post of u.posts || []) {
      const { data: insertedPost, error: postErr } = await supabase.from("posts").insert({
        user_id: userUuid,
        conteudo: post.conteudo,
        data_time: post.dataTime
      }).select().single().catch(e=>({ error: e }));
      if (postErr) console.error("post error", postErr);
      // likes/comments/compartilhamentos vazios no JSON inicial, então omitidos
    }
  }

  // 3) Follows: agora que todos os users existem, inserir follow relationships
  console.log("Inserindo follows (seguidores/seguindo)...");
  for (const u of users) {
    const followerUuid = mapping[u.id];
    if (!followerUuid) continue;

    // os arrays 'seguindo' indicam quem o usuário segue -> insert follower_id = followerUuid, following_id = mapping[target_custom_id]
    for (const s of u.seguindo || []) {
      const target = s.id;
      const followingUuid = mapping[target];
      if (!followingUuid) continue;
      await supabase.from("follows").insert({
        follower_id: followerUuid,
        following_id: followingUuid
      }).catch(e => {
        // ignora duplicate/erros
      });
    }
  }

  console.log("Importação finalizada.");
}

main().catch(err => {
  console.error("Erro geral:", err);
});
