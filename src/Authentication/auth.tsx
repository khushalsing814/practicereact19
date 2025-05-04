
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { toast } from 'react-toastify';
import { googleLogout } from '@react-oauth/google';

// Define user credentials
interface UserCredentials {
  email: string;
  password?: string;
  UserName?: string;
}

// Define AuthContext type
interface AuthContextType {
  user: UserCredentials | null;
  setUser: React.Dispatch<React.SetStateAction<UserCredentials | null>>;
  login: (credentials: UserCredentials) => Promise<boolean>;
  signup: (credentials: UserCredentials) => boolean;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for provider
interface AuthProviderProps {
  children: ReactNode;
}

// Helper for safe base64 decoding
// const safeBase64Decode = (value?: string): string => {
//   try {
//     return value ? atob(value) : '';
//   } catch (err) {
//     console.warn('Invalid base64 string:', value);
//     return '';
//   }
// };

// Auth provider component
export const Auth: React.FC<AuthProviderProps> = ({ children }) => {
  
  const [user, setUser] = useState<UserCredentials | null>(null);
  const CryptoJS = require("crypto-js");
  

  useEffect(() => {
    const savedEncryptedUser = localStorage.getItem('user');
    
    if (savedEncryptedUser) {
      try {
        // Decrypt the user data
        const passphrase = "manumanu!!!!22222222jjjjjj";
        const bytes = CryptoJS.AES.decrypt(savedEncryptedUser, passphrase);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        // Parse the decrypted data back into a user object
        const user = JSON.parse(decryptedData);

        // Set the user in the state
        setUser({
          email: user.email,
          UserName: user.UserName
        });
      } catch (err) {
        console.error('Failed to decrypt saved user from localStorage:', err);
        localStorage.removeItem('user'); // Optional cleanup
      }
    }
  }, []);




  // Login function
  const login = async ({
    email,
    password,
  }: UserCredentials): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:5000/loginCredencial', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();
      if (data?.email === email && data?.password === password) {
        toast.success(`login successfully`)
        // const userName = 'Manu'; 
        const user = {
          email: data.email,
          UserName: "Manu",
        };
        setUser(user);
        // Encrypt the user data
        const passphrase = "manumanu!!!!22222222jjjjjj";
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(user),
          passphrase
        ).toString();

        // Store encrypted data in localStorage
        localStorage.setItem("user", encryptedData);
        return true;
      } else {
        toast.error('Invalid credentials');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong while logging in');
      return false;
    }
  };

  // Signup function (mock)
  const signup = ({ email, password }: UserCredentials): boolean => {
    if (email && password) {
      setUser({ email, password });
      return true;
    }
    return false;
  };

  // Logout
  const logout = (): void => {
    localStorage.removeItem('user');
    setUser(null);
    googleLogout(); 
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
