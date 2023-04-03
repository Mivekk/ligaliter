import Link from "next/link";
import React from "react";
import { v4 } from "uuid";
import { useMutation } from "urql";
import { NewLobbyDocument } from "@/generated/graphql";
import { useRouter } from "next/router";

interface PickLobbyProps {}

const PickLobby: React.FC<PickLobbyProps> = () => {
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
        <Link
          href={`/join`}
          className="px-8 py-2 bg-plt-one text-white mt-2 hover:opacity-75"
        >
          Join lobby
        </Link>
      </div>
    </div>
  );
};

export default PickLobby;
