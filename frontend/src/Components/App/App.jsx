// import { useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import { Login, Register } from "../Pages";
import axios from "axios";
import { useEffect } from "react";
import { useLogin } from "../../context/loginContext";
import Dashboard from "../Pages/Dashboard";
import { useUserDetail } from "../../context/userContext";

const AppLayout = () => {
  return (
    <div className="App min-h-screen w-full flex flex-col">
      <div className="w-full">NavBar</div>
      <Outlet />
    </div>
  );
};
const App = () => {
  const { setIsLogin } = useLogin();
  const { setUserDetail } = useUserDetail();

  const checkAuth = async () => {
    try {
      const option = {
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/check-auth`,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.request(option);
      console.log("Login successful:", response.data);
      setIsLogin(true);
      setUserDetail(response?.data?.data);
    } catch (error) {
      const { status, data } = error?.response || {};
      if (status === 401 || status === 404) {
        setIsLogin(false);
        setUserDetail(null);
      }
      console.log(status, data);
    }
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
      ],
    },
  ]);
  useEffect(() => {
    checkAuth();
  }, []);
  return <RouterProvider router={router} />;
};
// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App;
