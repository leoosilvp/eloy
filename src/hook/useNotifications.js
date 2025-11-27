import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient"; // ajuste o path se necessário

const useNotifications = (userId) => {
    const [hasNotification, setHasNotification] = useState(false);

    useEffect(() => {
        if (!userId) return;

        // 1. Consulta inicial
        const load = async () => {
            const { data} = await supabase
                .from("notifications")
                .select("id")
                .eq("user_id", userId)
                .eq("viewed", false)
                .limit(1);

            setHasNotification(data?.length > 0);
        };

        load();

        // 2. Escutar em tempo real
        const channel = supabase
            .channel(`notifications-${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${userId}`
                },
                async () => {
                    const { data } = await supabase
                        .from("notifications")
                        .select("id")
                        .eq("user_id", userId)
                        .eq("viewed", false)
                        .limit(1);

                    setHasNotification(data?.length > 0);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return { hasNotification };
};

export default useNotifications;
