import { useCallback, useEffect, useState } from 'react';
import { getIsAuthenticated, logout } from '../features/user/userSlice';
import { useAppDispatch, useAppSelector } from '../store/helpers/storeHooks';
import { authApi } from '../features/user/userApi';
import logging from '../config/logging';

export const useCheckLocalStorageForCredentials = () => {
    const [validateToken] = authApi.useLazyValidateTokenQuery();

    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(getIsAuthenticated);

    const [isLoading, setIsLoading] = useState(true);

    /**
     * Check to see if we have a token.
     * If not, we are logged out initially,
     * If we do, verify it with the backend.
     */
    const checkLocalStorageForCredentials = useCallback(async () => {
        const fire_token = localStorage.getItem('fire_token');
        const uid = localStorage.getItem('uid');

        const triggerLogout = () => {
            dispatch(logout());
            setTimeout(() => {
                setIsLoading(false);
            }, 100);
        };

        if (!fire_token || !uid) {
            triggerLogout();

            return;
        }

        try {
            const validateResponse = await validateToken({ fire_token, uid });

            if (!validateResponse.data?.user) {
                triggerLogout();
            }
        } catch (error) {
            logging.error(error);
            triggerLogout();
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, validateToken]);

    useEffect(() => {
        if (isAuthenticated) return;

        setTimeout(() => {
            checkLocalStorageForCredentials();
        }, 100);
    }, [checkLocalStorageForCredentials, isAuthenticated]);

    return isLoading;
};
