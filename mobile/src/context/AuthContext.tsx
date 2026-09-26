import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types/auth';
import { setOnUnauthorized } from '../services/api';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('@token');
      await AsyncStorage.removeItem('@user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    setState({ token: null, user: null, isLoading: false, isAuthenticated: false });
  }, []);

  useEffect(() => {
    // Register 401 handler so API interceptor can trigger logout
    setOnUnauthorized(() => {
      logout();
    });
  }, [logout]);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        const userStr = await AsyncStorage.getItem('@user');

        if (token && userStr) {
          const user = JSON.parse(userStr);
          setState({
            token,
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      } catch (error) {
        // Clear potentially corrupted data
        await AsyncStorage.multiRemove(['@token', '@user']).catch(() => {});
        setState({ token: null, user: null, isLoading: false, isAuthenticated: false });
      }
    };

    loadAuth();
  }, []);

  const login = async (token: string, user: User) => {
    try {
      await AsyncStorage.setItem('@token', token);
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      setState({ token, user, isLoading: false, isAuthenticated: true });
    } catch (error) {
      console.error('Error during login storage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
