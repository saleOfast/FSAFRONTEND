import { useAuth } from "context/AuthContext";
import { UserRole } from "enum/common";
import MainLayout from "layout/MainLayout";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IAuthGuard {
    page: React.ReactNode;
    role?: UserRole[];
}

function AuthGuard({ page, role }: IAuthGuard) {
    const redirect = useNavigate();
    const { authState } = useAuth();
    useEffect(() => {
        if (!authState.isLoading) {
            if (!authState.authenticated) {
                redirect("/");
            }
            else if (role && (!authState.user?.role || !role?.includes(authState.user?.role))) {
                redirect("/403");
            }
        }
    }, [authState.authenticated, authState.isLoading, authState.user?.role, role]);

    if (authState.isLoading) {
        return null;
    }
    if (authState.authenticated) {
        return (
            <MainLayout>
                {page}
            </MainLayout>
        )
    }
    return null
}

export default AuthGuard