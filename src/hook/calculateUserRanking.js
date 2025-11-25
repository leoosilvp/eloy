export default function calculateUserRanking(usuarios) {

    const pesos = {
        seguidores: 4,
        estrelas: 3,
        likes: 2,
        comentarios: 1,
        compartilhamentos: 2
    };

    const ranking = usuarios.map(user => {

        const totalSeguidores = user.seguidores?.length || 0;
        const totalEstrelas = user.estrelas?.length || 0;

        const totalLikes = user.posts?.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
        const totalComentarios = user.posts?.reduce((sum, p) => sum + (p.comentarios?.length || 0), 0);
        const totalCompartilhamentos = user.posts?.reduce((sum, p) => sum + (p.compartilhamentos?.length || 0), 0);

        const score =
            totalSeguidores * pesos.seguidores +
            totalEstrelas * pesos.estrelas +
            totalLikes * pesos.likes +
            totalComentarios * pesos.comentarios +
            totalCompartilhamentos * pesos.compartilhamentos;

        return {
            id: user.id,
            nome: user.nome,
            foto: user.foto,
            titulo: user.titulo,
            score,
        };
    });

    ranking.sort((a, b) => b.score - a.score);

    ranking.forEach((user, index) => {
        user.posicao = index + 1;
    });

    return ranking;
}
