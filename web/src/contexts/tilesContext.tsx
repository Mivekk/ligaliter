import React, { createContext, useState } from "react";

import { TileType } from "../types";
import { boardSize, playerTilesAmount } from "../utils/game/constants";

type ContextType = {
  boardTiles: TileType[];
  setBoardTiles: React.Dispatch<React.SetStateAction<TileType[]>>;
  playerTiles: TileType[];
  setPlayerTiles: React.Dispatch<React.SetStateAction<TileType[]>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TilesContext = createContext<ContextType>({
  boardTiles: [],
  setBoardTiles: () => {},
  playerTiles: [],
  setPlayerTiles: () => {},
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

  return (
    <TilesContext.Provider
      value={{
        boardTiles,
        setBoardTiles,
        playerTiles,
        setPlayerTiles,
        isDragging,
        setIsDragging,
      }}
    >
      {children}
    </TilesContext.Provider>
  );
};

export default TilesContextProvider;
