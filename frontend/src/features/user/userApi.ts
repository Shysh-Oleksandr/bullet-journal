import { emptyAxiosApi } from '../../store/api/emptyAxiosApi';
import { Method } from '../../store/models';
import { DefaultAuthRequest, LoginResponse, ValidateTokenResponse } from './types';

export const authApi = emptyAxiosApi.injectEndpoints({
    endpoints(build) {
        return {
            login: build.query<LoginResponse, DefaultAuthRequest>({
                query({ fire_token, uid }) {
                    return {
                        url: `/users/login`,
                        method: Method.POST,
                        body: {
                            uid
                        },
                        headers: { Authorization: `Bearer ${fire_token}` }
                    };
                }
            }),
            validateToken: build.query<ValidateTokenResponse, DefaultAuthRequest>({
                query({ fire_token, uid }) {
                    return {
                        url: `/users/validate`,
                        method: Method.POST,
                        body: {
                            uid
                        },
                        headers: { Authorization: `Bearer ${fire_token}` }
                    };
                }
            })
        };
    },

    overrideExisting: false
});
