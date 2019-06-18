
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export abstract class IQuery {
    abstract userById(id: string): User | Promise<User>;

    abstract users(limit?: number, where?: undefined[]): User[] | Promise<User[]>;
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
    roles?: string[];
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
