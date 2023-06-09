export type TileType = {
  id: number;
  letter?: string;
  draggable: boolean;
  placed: boolean;
};

export type DraggedItemType = {
  id: number;
  letter: string;
};

export type HandleDropType = {
  fromId: number;
  toId: number;
  letter: string;
};

export type HandleDragType = {
  id: number;
};

export type TileBagType = {
  [key: string]: { amount: number; value: number };
};

export type HandleWrongDropType = {
  id: number;
  letter: string;
};

export type TileProps = TileType & {
  gameId: string;
};
