/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment ErrorFields on FieldError {\n  field\n  message\n}": types.ErrorFieldsFragmentDoc,
    "fragment UserFields on User {\n  id\n  username\n  email\n  created_at\n  updated_at\n}": types.UserFieldsFragmentDoc,
    "mutation JoinLobby($uuid: String!) {\n  joinLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.JoinLobbyDocument,
    "mutation Login($options: LoginInput!) {\n  login(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation NewLobby($uuid: String!) {\n  newLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.NewLobbyDocument,
    "mutation QuitLobby($uuid: String!) {\n  quitLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.QuitLobbyDocument,
    "mutation Register($options: RegisterInput!) {\n  register(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.RegisterDocument,
    "query LobbyPlayersQuery($uuid: String!) {\n  lobbyPlayersQuery(uuid: $uuid) {\n    ...UserFields\n  }\n}": types.LobbyPlayersQueryDocument,
    "query Me {\n  me {\n    ...UserFields\n  }\n}": types.MeDocument,
    "query Users {\n  users {\n    ...UserFields\n  }\n}": types.UsersDocument,
    "subscription LobbyPlayers($uuid: String!) {\n  lobbyPlayers(uuid: $uuid) {\n    id\n    username\n    email\n    created_at\n    updated_at\n  }\n}": types.LobbyPlayersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ErrorFields on FieldError {\n  field\n  message\n}"): (typeof documents)["fragment ErrorFields on FieldError {\n  field\n  message\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment UserFields on User {\n  id\n  username\n  email\n  created_at\n  updated_at\n}"): (typeof documents)["fragment UserFields on User {\n  id\n  username\n  email\n  created_at\n  updated_at\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation JoinLobby($uuid: String!) {\n  joinLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"): (typeof documents)["mutation JoinLobby($uuid: String!) {\n  joinLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($options: LoginInput!) {\n  login(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"): (typeof documents)["mutation Login($options: LoginInput!) {\n  login(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout\n}"): (typeof documents)["mutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation NewLobby($uuid: String!) {\n  newLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"): (typeof documents)["mutation NewLobby($uuid: String!) {\n  newLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation QuitLobby($uuid: String!) {\n  quitLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"): (typeof documents)["mutation QuitLobby($uuid: String!) {\n  quitLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($options: RegisterInput!) {\n  register(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"): (typeof documents)["mutation Register($options: RegisterInput!) {\n  register(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query LobbyPlayersQuery($uuid: String!) {\n  lobbyPlayersQuery(uuid: $uuid) {\n    ...UserFields\n  }\n}"): (typeof documents)["query LobbyPlayersQuery($uuid: String!) {\n  lobbyPlayersQuery(uuid: $uuid) {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    ...UserFields\n  }\n}"): (typeof documents)["query Me {\n  me {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Users {\n  users {\n    ...UserFields\n  }\n}"): (typeof documents)["query Users {\n  users {\n    ...UserFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription LobbyPlayers($uuid: String!) {\n  lobbyPlayers(uuid: $uuid) {\n    id\n    username\n    email\n    created_at\n    updated_at\n  }\n}"): (typeof documents)["subscription LobbyPlayers($uuid: String!) {\n  lobbyPlayers(uuid: $uuid) {\n    id\n    username\n    email\n    created_at\n    updated_at\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;