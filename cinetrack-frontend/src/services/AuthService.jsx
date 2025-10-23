import { endpoints } from "./backendApi";

export const AuthService = {
  _decodeJwt: (token) => {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      return decoded || {};
    } catch (_e) {
      return {};
    }
  },

  isTokenExpired: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("AuthService: No token found");
      return true;
    }
    const { exp } = AuthService._decodeJwt(token);
    if (!exp) {
      console.log("AuthService: No exp claim in token, assuming not expired");
      return false; // if no exp claim, assume not expired
    }
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const isExpired = exp <= nowInSeconds;
    console.log("AuthService: Token exp check", { exp, nowInSeconds, isExpired });
    return isExpired;
  },
  login: async (credentials) => {
    const response = await fetch(endpoints.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      // Handle different backend response structures
      const user = data.user || data;
      const token = data.token || user.Token;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Dispatch custom event to notify components of auth change
      window.dispatchEvent(new CustomEvent('authChange'));
      
      return { success: true, data };
    } else {
      return { success: false, error: data.message || "Login failed" };
    }
  },

  register: async (userData) => {
    const response = await fetch(endpoints.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      // Handle different backend response structures
      const user = data.user || data;
      const token = data.token || user.Token;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { success: true, data };
    } else {
      return { success: false, error: data.message || "Registration failed" };
    }
  },

  logout: async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await fetch(endpoints.logout, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Logout request failed:", error);
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Dispatch custom event to notify components of auth change
    window.dispatchEvent(new CustomEvent('authChange'));
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("AuthService: isAuthenticated - no token");
      return false;
    }
    const isExpired = AuthService.isTokenExpired();
    const isAuth = !isExpired;
    console.log("AuthService: isAuthenticated result", { isAuth, isExpired });
    return isAuth;
  },
};
