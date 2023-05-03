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
    "mutation EndTurn($input: PlayTurnInput!) {\n  endTurn(input: $input)\n}": types.EndTurnDocument,
    "mutation JoinLobby($uuid: String!) {\n  joinLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.JoinLobbyDocument,
    "mutation Login($options: LoginInput!) {\n  login(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation MoveTile($input: MoveTileInput!) {\n  moveTile(input: $input)\n}": types.MoveTileDocument,
    "mutation NewGame($uuid: String!) {\n  newGame(uuid: $uuid) {\n    players {\n      id\n    }\n  }\n}": types.NewGameDocument,
    "mutation NewLobby($uuid: String!) {\n  newLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.NewLobbyDocument,
    "mutation QuitLobby($uuid: String!) {\n  quitLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.QuitLobbyDocument,
    "mutation Register($options: RegisterInput!) {\n  register(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}": types.RegisterDocument,
    "query GetBoardTiles($uuid: String!) {\n  getBoardTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}": types.GetBoardTilesDocument,
    "query GetLobbyPlayers($uuid: String!) {\n  getLobbyPlayers(uuid: $uuid) {\n    owner {\n      ...UserFields\n    }\n    players {\n      ...UserFields\n    }\n  }\n}": types.GetLobbyPlayersDocument,
    "query GetPlayerStats($uuid: String!) {\n  getPlayerStats(uuid: $uuid) {\n    id\n    activePlayer {\n      id\n      username\n    }\n    players {\n      id\n      username\n      points\n    }\n  }\n}": types.GetPlayerStatsDocument,
    "query GetPlayerTiles($uuid: String!) {\n  getPlayerTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}": types.GetPlayerTilesDocument,
    "query Me {\n  me {\n    ...UserFields\n  }\n}": types.MeDocument,
    "query Users {\n  users {\n    ...UserFields\n  }\n}": types.UsersDocument,
    "subscription UpdateBoardTiles($uuid: String!) {\n  updateBoardTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}": types.UpdateBoardTilesDocument,
    "subscription UpdateLobbyPlayers($uuid: String!) {\n  updateLobbyPlayers(uuid: $uuid) {\n    players {\n      ...UserFields\n    }\n    started\n  }\n}": types.UpdateLobbyPlayersDocument,
    "subscription UpdatePlayerStats($uuid: String!) {\n  updatePlayerStats(uuid: $uuid) {\n    id\n    activePlayer {\n      id\n      username\n    }\n    players {\n      id\n      username\n      points\n    }\n  }\n}": types.UpdatePlayerStatsDocument,
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
export function graphql(source: "mutation EndTurn($input: PlayTurnInput!) {\n  endTurn(input: $input)\n}"): (typeof documents)["mutation EndTurn($input: PlayTurnInput!) {\n  endTurn(input: $input)\n}"];
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
export function graphql(source: "mutation QuitLobby($uuid: String!) {\n  quitLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"): (typeof documents)["mutation QuitLobby($uuid: String!) {\n  quitLobby(uuid: $uuid) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($options: RegisterInput!) {\n  register(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"): (typeof documents)["mutation Register($options: RegisterInput!) {\n  register(options: $options) {\n    error {\n      ...ErrorFields\n    }\n    user {\n      ...UserFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetBoardTiles($uuid: String!) {\n  getBoardTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"): (typeof documents)["query GetBoardTiles($uuid: String!) {\n  getBoardTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetLobbyPlayers($uuid: String!) {\n  getLobbyPlayers(uuid: $uuid) {\n    owner {\n      ...UserFields\n    }\n    players {\n      ...UserFields\n    }\n  }\n}"): (typeof documents)["query GetLobbyPlayers($uuid: String!) {\n  getLobbyPlayers(uuid: $uuid) {\n    owner {\n      ...UserFields\n    }\n    players {\n      ...UserFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetPlayerStats($uuid: String!) {\n  getPlayerStats(uuid: $uuid) {\n    id\n    activePlayer {\n      id\n      username\n    }\n    players {\n      id\n      username\n      points\n    }\n  }\n}"): (typeof documents)["query GetPlayerStats($uuid: String!) {\n  getPlayerStats(uuid: $uuid) {\n    id\n    activePlayer {\n      id\n      username\n    }\n    players {\n      id\n      username\n      points\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetPlayerTiles($uuid: String!) {\n  getPlayerTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"): (typeof documents)["query GetPlayerTiles($uuid: String!) {\n  getPlayerTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"];
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
export function graphql(source: "subscription UpdateBoardTiles($uuid: String!) {\n  updateBoardTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"): (typeof documents)["subscription UpdateBoardTiles($uuid: String!) {\n  updateBoardTiles(uuid: $uuid) {\n    id\n    letter\n    draggable\n    placed\n    userId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription UpdateLobbyPlayers($uuid: String!) {\n  updateLobbyPlayers(uuid: $uuid) {\n    players {\n      ...UserFields\n    }\n    started\n  }\n}"): (typeof documents)["subscription UpdateLobbyPlayers($uuid: String!) {\n  updateLobbyPlayers(uuid: $uuid) {\n    players {\n      ...UserFields\n    }\n    started\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription UpdatePlayerStats($uuid: String!) {\n  updatePlayerStats(uuid: $uuid) {\n    id\n    activePlayer {\n      id\n      username\n    }\n    players {\n      id\n      username\n      points\n    }\n  }\n}"): (typeof documents)["subscription UpdatePlayerStats($uuid: String!) {\n  updatePlayerStats(uuid: $uuid) {\n    id\n    activePlayer {\n      id\n      username\n    }\n    players {\n      id\n      username\n      points\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;