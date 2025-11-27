import { supabase } from "../hook/supabaseClient";

export default async function calculateUserRanking(loggedUserId) {
    // 🔥 Buscar perfis
    const { data: users } = await supabase
        .from("profiles")
        .select("id, nome, foto, titulo, seguidores, estrelas");

    if (!users) return [];

    // 🔥 Buscar posts
    const { data: posts } = await supabase
        .from("posts")
        .select("id, author_id, created_at, likes, comentarios, compartilhamentos");

    // 🔥 Calcular ranking
    const ranking = users.map(user => {
        const seguidores = Array.isArray(user.seguidores) ? user.seguidores.length : 0;
        const estrelas = user.estrelas || 0;

        const userPosts = posts?.filter(p => p.author_id === user.id) || [];
        const totalLikes = userPosts.reduce((s, p) => s + (p.likes || 0), 0);
        const totalComentarios = userPosts.reduce(
            (s, p) => s + (Array.isArray(p.comentarios) ? p.comentarios.length : 0),
            0
        );
        const totalCompartilhamentos = userPosts.reduce(
            (s, p) => s + (p.compartilhamentos || 0),
            0
        );

        const now = new Date();
        const atividadeRecente = userPosts.reduce((sum, p) => {
            const days = (now - new Date(p.created_at)) / (1000 * 60 * 60 * 24);
            return sum + Math.max(0, 1 - days / 30);
        }, 0);

        const score =
            seguidores * 4 +
            estrelas * 3 +
            totalLikes * 2 +
            totalComentarios * 1 +
            totalCompartilhamentos * 2 +
            atividadeRecente * 5;

        return {
            ...user,
            seguidores,
            estrelas,
            totalLikes,
            totalComentarios,
            totalCompartilhamentos,
            atividadeRecente,
            score
        };
    });

    // 🔥 Ordena pelo score
    ranking.sort((a, b) => b.score - a.score);

    ranking.forEach((u, i) => {
        u.posicao = i + 1;
        if (u.id === loggedUserId) {
            localStorage.setItem("myRankingPos", String(u.posicao));
        }
    });

    return ranking;
}
