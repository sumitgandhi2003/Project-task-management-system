import { createContext, useState, useContext, useEffect } from "react";
const loginContext = createContext();
const useLogin = () => useContext(loginContext);

const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(() => {
    const state = localStorage.getItem("isLogin") || false;
    return state;
  });
  useEffect(() => {
    localStorage.setItem("isLogin", isLogin);
  }, [isLogin]);
  return (
    <loginContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </loginContext.Provider>
  );
};
export { LoginProvider, useLogin };
