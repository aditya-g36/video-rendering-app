import { createContext, useState, useEffect, ReactNode } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<any>(null);

export default AuthContext;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  let [authTokens, setAuthTokens] = useState(() => {
    const storedTokens = localStorage.getItem("authTokens");
    return storedTokens ? JSON.parse(storedTokens) : null;
  });
  let [user, setUser] = useState(() => {
    const storedTokens = localStorage.getItem("authTokens");
    return storedTokens ? jwtDecode(storedTokens) : null;
  });

  let [loading, setLoading] = useState(true);

  const history = useNavigate();

  let loginUser = async (e: any) => {
    e.preventDefault();

    let response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.token));
      localStorage.setItem("authTokens", JSON.stringify(data));
      history("/");
    } else {
      alert("something went wrong!");
    }
  };

  let signupuser = async (e: any) => {
    e.preventDefault();

    let response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
        password2: e.target.password2.value,
      }),
    });
    if (response.status !== 200) {
      history("/");
    } else {
      alert("something went wrong!");
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    history("/login");
  };

  // let updateToken = async () => {
  //   console.log("update token called");
  //   let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
  //     method: "POST",
  //     headers: {
  //       "content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       refresh: authTokens.refresh,
  //     }),
  //   });
  //   let data = await response.json();

  //   if (response.status === 200) {
  //     setAuthTokens(data);
  //     setUser(jwt_decode(data.access));
  //     localStorage.setItem("authTokens", JSON.stringify(data));
  //   } else {
  //     logoutUser();
  //   }
  // };

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    signupuser: signupuser,
    logoutUser: logoutUser,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.token));
      setLoading(false);
    }
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
