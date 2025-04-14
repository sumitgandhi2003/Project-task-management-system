import { createContext, useState, useContext } from "react";
const userContext = createContext();
const useUserDetail = () => useContext(userContext);

const UserProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState();

  return (
    <userContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </userContext.Provider>
  );
};
export { UserProvider, useUserDetail };
