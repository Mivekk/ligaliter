import { NewLobbyDocument } from "@/generated/graphql";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction } from "react";
import { useMutation } from "urql";
import { v4 } from "uuid";

interface SelectLobbyProps {
  setSelectLobby: Dispatch<SetStateAction<boolean>>;
}

const SelectLobby: React.FC<SelectLobbyProps> = ({ setSelectLobby }) => {
  const router = useRouter();
  const [, newLobby] = useMutation(NewLobbyDocument);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xl text-bold text-slate-100">
        Click to join a lobby or create a new one
      </div>
      <div className="flex gap-4">
        <button
          onClick={async () => {
            const uuid = v4();
            const lobby = await newLobby({ uuid });
            if (!lobby) {
              console.log("couldn't create lobby");
            }

            router.push(`/lobby/${uuid}`);
          }}
          className="px-8 py-2 bg-plt-one text-white mt-2 hover:opacity-75"
        >
          New lobby
        </button>
        <button
          onClick={() => setSelectLobby(false)}
          className="px-8 py-2 bg-plt-one text-white mt-2 hover:opacity-75"
        >
          Join lobby
        </button>
      </div>
    </div>
  );
};

export default SelectLobby;
