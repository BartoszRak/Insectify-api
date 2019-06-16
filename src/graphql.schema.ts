
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export abstract class IQuery {
    abstract userById(id: string): User | Promise<User>;

    abstract users(limit?: number): User[] | Promise<User[]>;
}

export class User {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    adress?: UserAdress;
}

export class UserAdress {
    country?: string;
    region?: string;
    city?: string;
    postcode?: string;
    street?: string;
    house?: string;
    flat?: string;
}

export type Date = any;
