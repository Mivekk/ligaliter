import React, { createContext, useState } from "react";

import { TileBagType, TileType } from "../types";
import { boardSize, playerTilesAmount } from "../utils/game/constants";

type ContextType = {
  boardTiles: TileType[];
  setBoardTiles: React.Dispatch<React.SetStateAction<TileType[]>>;
  playerTiles: TileType[];
  setPlayerTiles: React.Dispatch<React.SetStateAction<TileType[]>>;
  tileBag: TileBagType;
  setTileBag: React.Dispatch<React.SetStateAction<TileBagType>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TilesContext = createContext<ContextType>({
  boardTiles: [],
  setBoardTiles: () => {},
  playerTiles: [],
  setPlayerTiles: () => {},
  tileBag: {},
  setTileBag: () => {},
  isDragging: false,
  setIsDragging: () => {},
});

interface TilesContextProviderProps {
  children: React.ReactNode;
}

const TilesContextProvider: React.FC<TilesContextProviderProps> = ({
  children,
}) => {
  const [boardTiles, setBoardTiles] = useState<TileType[]>(() => {
    const tmpTiles: TileType[] = [];
    for (let i = 0; i < boardSize; i++) {
      tmpTiles[i] = {
        id: i,
        draggable: false,
        placed: false,
      };
    }
    return tmpTiles;
  });

  const [isDragging, setIsDragging] = useState(false);

  const [playerTiles, setPlayerTiles] = useState<TileType[]>(() => {
    const tmpTiles: TileType[] = [];
    for (let i = 0; i < playerTilesAmount; i++) {
      tmpTiles[i] = {
        id: i + boardSize,
        draggable: true,
        placed: false,
      };
    }
    return tmpTiles;
  });

  const [tileBag, setTileBag] = useState<TileBagType>({
    A: { amount: 9, value: 1 },
    B: { amount: 2, value: 3 },
    C: { amount: 2, value: 3 },
    D: { amount: 4, value: 2 },
    E: { amount: 12, value: 1 },
    F: { amount: 2, value: 4 },
    G: { amount: 3, value: 2 },
    H: { amount: 2, value: 4 },
    I: { amount: 9, value: 1 },
    J: { amount: 1, value: 8 },
    K: { amount: 1, value: 5 },
    L: { amount: 4, value: 1 },
    M: { amount: 2, value: 3 },
    N: { amount: 6, value: 1 },
    O: { amount: 8, value: 1 },
    P: { amount: 2, value: 3 },
    Q: { amount: 1, value: 10 },
    R: { amount: 6, value: 1 },
    S: { amount: 4, value: 1 },
    T: { amount: 6, value: 1 },
    U: { amount: 4, value: 1 },
    V: { amount: 2, value: 4 },
    W: { amount: 2, value: 4 },
    X: { amount: 1, value: 8 },
    Y: { amount: 2, value: 4 },
    Z: { amount: 1, value: 10 },
    BLANK: { amount: 2, value: 0 },
    "?": { amount: 0, value: -1 },
  });

  return (
    <TilesContext.Provider
      value={{
        boardTiles,
        setBoardTiles,
        playerTiles,
        setPlayerTiles,
        tileBag,
        setTileBag,
        isDragging,
        setIsDragging,
      }}
    >
      {children}
    </TilesContext.Provider>
  );
};

export default TilesContextProvider;
