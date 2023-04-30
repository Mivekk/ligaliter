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
    "mutation MoveTile($input: MoveTileInput!) {\n  moveTile(input: $input)\n}": types.MoveTileDocument,
    "mutation NewGame($uuid: String!) {\n  newGame(uuid: $uuid) {\n    players {\n      id\n    }\n  }\n}": types.NewGameDocument,
    "mutation NewLobby($uuid: String!) {\n  newLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.NewLobbyDocument,
    "mutation PlayTurn($input: PlayTurnInput!) {\n  playTurn(input: $input)\n}": types.PlayTurnDocument,
    "mutation QuitLobby($uuid: String!) {\n  quitLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.QuitLobbyDocument,
    "mutation Register($options: RegisterInput!) {\n  register(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.RegisterDocument,
    "query GetBoardTilesQuery($uuid: String!) {\n  getBoardTilesQuery(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}": types.GetBoardTilesQueryDocument,
    "query GetTilesQuery($uuid: String!) {\n  getTilesQuery(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}": types.GetTilesQueryDocument,
    "query LobbyPlayersQuery($uuid: String!) {\n  lobbyPlayersQuery(uuid: $uuid) {\n    owner {\n      ...UserFields\n    }\n    players {\n      ...UserFields\n    }\n  }\n}": types.LobbyPlayersQueryDocument,
    "query MakingTurn($uuid: String!) {\n  makingTurn(uuid: $uuid) {\n    id\n    activePlayer\n  }\n}": types.MakingTurnDocument,
    "query Me {\n  me {\n    ...UserFields\n  }\n}": types.MeDocument,
    "query Users {\n  users {\n    ...UserFields\n  }\n}": types.UsersDocument,
    "subscription GetBoardTiles($uuid: String!) {\n  getBoardTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}": types.GetBoardTilesDocument,
    "subscription LobbyPlayers($uuid: String!) {\n  lobbyPlayers(uuid: $uuid) {\n    players {\n      ...UserFields\n    }\n    started\n  }\n}": types.LobbyPlayersDocument,
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
export function graphql(source: "mutation MoveTile($input: MoveTileInput!) {\n  moveTile(input: $input)\n}"): (typeof documents)["mutation MoveTile($input: MoveTileInput!) {\n  moveTile(input: $input)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation NewGame($uuid: String!) {\n  newGame(uuid: $uuid) {\n    players {\n      id\n    }\n  }\n}"): (typeof documents)["mutation NewGame($uuid: String!) {\n  newGame(uuid: $uuid) {\n    players {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation NewLobby($uuid: String!) {\n  newLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"): (typeof documents)["mutation NewLobby($uuid: String!) {\n  newLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation PlayTurn($input: PlayTurnInput!) {\n  playTurn(input: $input)\n}"): (typeof documents)["mutation PlayTurn($input: PlayTurnInput!) {\n  playTurn(input: $input)\n}"];
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
export function graphql(source: "query GetBoardTilesQuery($uuid: String!) {\n  getBoardTilesQuery(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"): (typeof documents)["query GetBoardTilesQuery($uuid: String!) {\n  getBoardTilesQuery(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTilesQuery($uuid: String!) {\n  getTilesQuery(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"): (typeof documents)["query GetTilesQuery($uuid: String!) {\n  getTilesQuery(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query LobbyPlayersQuery($uuid: String!) {\n  lobbyPlayersQuery(uuid: $uuid) {\n    owner {\n      ...UserFields\n    }\n    players {\n      ...UserFields\n    }\n  }\n}"): (typeof documents)["query LobbyPlayersQuery($uuid: String!) {\n  lobbyPlayersQuery(uuid: $uuid) {\n    owner {\n      ...UserFields\n    }\n    players {\n      ...UserFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MakingTurn($uuid: String!) {\n  makingTurn(uuid: $uuid) {\n    id\n    activePlayer\n  }\n}"): (typeof documents)["query MakingTurn($uuid: String!) {\n  makingTurn(uuid: $uuid) {\n    id\n    activePlayer\n  }\n}"];
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
export function graphql(source: "subscription GetBoardTiles($uuid: String!) {\n  getBoardTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"): (typeof documents)["subscription GetBoardTiles($uuid: String!) {\n  getBoardTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription LobbyPlayers($uuid: String!) {\n  lobbyPlayers(uuid: $uuid) {\n    players {\n      ...UserFields\n    }\n    started\n  }\n}"): (typeof documents)["subscription LobbyPlayers($uuid: String!) {\n  lobbyPlayers(uuid: $uuid) {\n    players {\n      ...UserFields\n    }\n    started\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;