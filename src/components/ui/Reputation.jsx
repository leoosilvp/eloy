import { useEffect, useState } from "react";
import useProfile from "../../hook/useProfile";
import calculateUserRanking from "../../hook/calculateUserRanking";
import { NavLink } from "react-router-dom";

export default function Reputation() {
    const { data: me } = useProfile();
    const [posicao, setPosicao] = useState(null);

    useEffect(() => {
        if (!me) return;

        async function loadRanking() {
            const ranking = await calculateUserRanking(me.id);
            setPosicao(localStorage.getItem("myRankingPos"));
        }

        loadRanking();
    }, [me]);

    return (
        <NavLink to="/ranking" className="repute">
            <p>Você está em</p>
            <p className="position">
                {posicao ? `${posicao}º` : "..."}
            </p>
            <p>lugar!</p>
        </NavLink>
    );
}
