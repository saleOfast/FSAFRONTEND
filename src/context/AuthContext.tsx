import React, { createContext, useContext, useState } from 'react';
import { logoutService } from '../services/authService';
import { navigateTo, removeItemFromLS } from 'utils/common';
import { LS_KEYS } from "../app-constants";
import { UserData } from 'types/User';

interface IAuthProvider {
    children: any;
}

interface IAuthState {
    authenticated: boolean;
    isLoading: boolean;
    user: UserData | null;
}
interface AuthContextInterface {
    authState: IAuthState;
    setAuthState: React.Dispatch<React.SetStateAction<IAuthState>>;
    logout: () => any;
}

const AuthContext = createContext<AuthContextInterface>({
    authState: {
        isLoading: true,
        authenticated: false,
        user: null,
    },
    logout: () => { },
    setAuthState: () => { },
});
const { Provider } = AuthContext;

const AuthProvider = ({ children }: IAuthProvider) => {
    const [authState, setAuthState] = useState<IAuthState>({
        authenticated: false,
        isLoading: true,
        user: null,
    });

    const logout = async () => {
        try {
            setAuthState({
                authenticated: false,
                isLoading: false,
                user: null,
            });
            navigateTo("/login");
            await logoutService();
        } catch (error) {
            setAuthState({
                authenticated: false,
                isLoading: false,
                user: null,
            });
        }
        removeItemFromLS(LS_KEYS.accessToken);
    };

    return (
        <Provider
            value={{
                authState,
                setAuthState,
                logout,
            }}>
            {children}
        </Provider>
    );
};

const useAuth = () => useContext(AuthContext);
export { AuthContext, AuthProvider, useAuth };
