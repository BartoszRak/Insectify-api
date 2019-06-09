
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export abstract class IQuery {
    abstract getUserById(id?: string): User[] | Promise<User[]>;
}

export class User {
    _id?: string;
    name?: string;
}

export type Date = any;
