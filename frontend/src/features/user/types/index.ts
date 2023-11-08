export type User = {
    _id: string;
    uid: string;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export type LoginResponse = {
    user: User;
};

export type ValidateTokenResponse = {
    user: User;
    fire_token: string;
};

export type DefaultAuthRequest = {
    uid: string;
    fire_token: string;
};
