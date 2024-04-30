import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useEffect } from "react";

const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setToken();
    navigate("/", { replace: true });
  }, [setToken, navigate]);

  return (
    <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
      <h1 className="text-2xl font-semibold">Loging out...</h1>
    </div>
  );
};

export default Logout;