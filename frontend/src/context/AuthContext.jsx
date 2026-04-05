import { createContext, useContext, useState } from "react";

// Step 1: Create the context (like creating the TV remote)
const AuthContext = createContext();

// Step 1: Create the context (like creating the TV remote)
export const AuthProvider = ({ children }) => {

   // Initialize directly from localStorage
  // No useEffect needed!
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    })

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    })

    // Login function
    const login = (userData, userToken) => {
        // Save to localStorage (survives page refresh!)
        localStorage.setItem('token', userToken)
        localStorage.setItem('user', JSON.stringify(userData))

        // Save to state (for immediate UI update)
        setUser(userData)
        setToken(userToken)
    }

    // Logout function
    const logout = () => {
        // Remove from localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        //Clear state
        setUser(null)
        setToken(null)
    }

    // Values available to ALL components
    const value = {
        user,
        token,
        login,
        logout,
        isLoggedIn: !!token  // !! converts to true/false
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Step 3: Custom hook to USE the context
// Instead of: const { user } = useContext(AuthContext)
// We write:   const { user } = useAuth()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    // 3. Error handling: check if hook is used outside Provider
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};