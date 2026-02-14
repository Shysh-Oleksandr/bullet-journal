export default interface User {
  _id: string;
  uid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  access_token: string;
}

export interface ShortUser {
  _id: string;
  uid: string;
  name: string;
  access_token: string;
}

export const DEFAULT_USER: User = {
  _id: "",
  uid: "",
  name: "",
  createdAt: "",
  updatedAt: "",
  access_token: "",
};

export type LoginResponse = {
  user: User;
  access_token: string;
};

export type LoginRequest = {
  fire_token: string;
};

export type RefreshTokenRequest = {
  access_token: string;
};

export type RefreshTokenResponse = {
  access_token: string;
};

export enum ApiStatusCodes {
  Unauthorized = 401,
  AccessDenied = 403,
  InternalServerError = 500,
  BadRequest = 400,
}
