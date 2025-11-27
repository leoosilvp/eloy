import { supabase } from "../hook/supabaseClient";

export default async function calculateUserRanking(loggedUserId) {
  // Buscar perfis
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, user_name, nome, foto, titulo, seguidores, seguindo, estrelas");

  if (usersError || !users) {
    console.error("Erro ao buscar perfis:", usersError);
    return [];
  }

  // Buscar posts
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id, user_id, created_at, likes, comentarios, compartilhamentos");

  if (postsError || !posts) {
    console.error("Erro ao buscar posts:", postsError);
    return [];
  }

  const now = new Date();

  // Calcular ranking
  const ranking = users.map(user => {
    const seguidoresCount = Array.isArray(user.seguidores) ? user.seguidores.length : 0;
    const seguindoCount = Array.isArray(user.seguindo) ? user.seguindo.length : 0;
    const estrelasCount = Array.isArray(user.estrelas) ? user.estrelas.length : 0;

    const userPosts = posts.filter(p => p.author_id === user.id) || [];
    const totalLikes = userPosts.reduce((sum, p) => sum + Number(p.likes || 0), 0);
    const totalComentarios = userPosts.reduce(
      (sum, p) => sum + (Array.isArray(p.comentarios) ? p.comentarios.length : 0),
      0
    );
    const totalCompartilhamentos = userPosts.reduce(
      (sum, p) => sum + Number(p.compartilhamentos || 0),
      0
    );

    // Atividade recente (posts nos últimos 30 dias)
    const atividadeRecente = userPosts.reduce((sum, p) => {
      const days = (now - new Date(p.created_at)) / (1000 * 60 * 60 * 24);
      return sum + Math.max(0, 1 - days / 30);
    }, 0);

    // Cálculo de score
    const score =
      seguidoresCount * 6 +
      estrelasCount * 7 +
      totalLikes * 2 +
      totalComentarios * 1.1 +
      totalCompartilhamentos * 1.5 +
      atividadeRecente * 0.5;

    return {
      ...user,
      seguidoresCount,
      seguindoCount,
      estrelasCount,
      totalLikes,
      totalComentarios,
      totalCompartilhamentos,
      atividadeRecente,
      score,
    };
  });

  // Ordena pelo score
  ranking.sort((a, b) => b.score - a.score);

  // Salvar posição do usuário logado em cache
  ranking.forEach((u, i) => {
    u.posicao = i + 1;
    if (u.id === loggedUserId) {
      localStorage.setItem("myRankingPos", String(u.posicao));
    }
  });

  return ranking;
}
