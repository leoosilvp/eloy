import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("eloy_user");

    if (!user) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);
};

export default useAuthRedirect;
