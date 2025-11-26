import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";

function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const { data: auth } = await supabase.auth.getUser();
            const user = auth?.user;

            if (!user) return null;

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) throw error;

            return data;
        },
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        suspense: true,
    });
};

export default useProfile;
