
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class ActivationInput {
    activationToken?: string;
    email?: string;
}

export class LoginInput {
    email?: string;
    password?: string;
}

export class RegisterInput {
    email?: string;
    firstName?: string;
    password?: string;
    lastName?: string;
    phoneNumber?: string;
    country?: string;
    region?: string;
    city?: string;
    postCode?: string;
    street?: string;
    houseNumber?: string;
    flatNumber?: string;
}

export class RequestActivationInput {
    email?: string;
}

export class WhereStatement {
    field?: string;
    by?: string;
    value?: string;
}

export class AuthorizationToken {
    token?: string;
    expireTime?: number;
}

export abstract class IMutation {
    abstract register(registerInput?: RegisterInput): User | Promise<User>;

    abstract login(loginInput?: LoginInput): AuthorizationToken | Promise<AuthorizationToken>;

    abstract activate(activationInput?: ActivationInput): User | Promise<User>;

    abstract requestActivation(requestActivationInput?: RequestActivationInput): User | Promise<User>;
}

export abstract class IQuery {
    abstract getRoles(): Role[] | Promise<Role[]>;

    abstract userById(id: string): User | Promise<User>;

    abstract users(limit?: number, where?: WhereStatement[]): User[] | Promise<User[]>;
}

export class Role {
    id: string;
    name: string;
    permissions: JSONObject;
}

export class Session {
    user?: User;
}

export class User {
    id: string;
    activationSalt?: string;
    passwordHash?: string;
    passwordSalt?: string;
    email?: string;
    isEmailConfirmed?: boolean;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    adress?: UserAdress;
    roles?: JSONObject;
}

export class UserAdress {
    country?: string;
    region?: string;
    city?: string;
    postCode?: string;
    street?: string;
    houseNumber?: string;
    flatNumber?: string;
}

export type Date = any;
export type JSON = any;
export type JSONObject = any;
