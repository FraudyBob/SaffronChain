"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from storage on app start
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
  
        if (!storedToken) {
          setLoading(false);
          return;
        }
  
        const parts = storedToken.split(".");
        if (parts.length !== 3) throw new Error("Malformed JWT");
  
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
  
        // ✅ Check expiry — remove if expired
        if (payload.exp && payload.exp < now) {
          console.warn("[Auth] Token expired, clearing...");
          localStorage.removeItem("token");
          document.cookie = "token=; path=/; max-age=0;";
          setToken(null);
          setUser(null);
          setLoading(false);
          return;
        }
  
        const role = payload.role?.toLowerCase() || "unknown";
        setToken(storedToken);
        setUser({ email: payload.sub, role });
        setAuthToken(storedToken);
      } catch (err) {
        console.error("[Auth] Token error:", err);
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; max-age=0;";
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    initAuth();
  }, []);
  
  
  
  

  // Handle login success
  const login = (token, backendRole) => {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax;`;
  
    setAuthToken(token);
    setToken(token);
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role || backendRole || "unknown";
      setUser({ email: payload.sub, role });
      toast.success(`Logged in as ${role}`);
      router.replace(`/dashboard/${role.toLowerCase()}`);
    } catch (err) {
      console.error("[Auth] Invalid token payload:", err);
      setUser(null);
      toast.error("Token error. Please log in again.");
    }
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0;";

    setAuthToken(null);
    setToken(null);
    setUser(null);

    toast.success("Logged out successfully");
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
