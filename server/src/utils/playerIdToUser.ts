import { User } from "../entities/User";

export const playerIdToUser = async (
  data: { id: number }[]
): Promise<User[]> => {
  const players = await Promise.all(
    data.map(async (item) => await User.findOneBy({ id: item.id }))
  ).then((res) => res.filter((item) => item !== null));

  return players as User[];
};
