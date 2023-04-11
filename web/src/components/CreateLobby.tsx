import React from "react";
import Heading from "./Heading";
import { v4 } from "uuid";
import { useRouter } from "next/router";
import { useMutation } from "urql";
import { NewLobbyDocument } from "@/generated/graphql";

const CreateLobby: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, newLobby] = useMutation(NewLobbyDocument);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center">
        <Heading>Create lobby!</Heading>
      </div>
      <button
        className="w-36 h-10 bg-utility text-white mt-2 hover:opacity-75 rounded-xl"
        onClick={async () => {
          let uuid = v4();
          uuid = uuid.replace(/-/g, "");
          uuid = Buffer.from(uuid, "hex").toString("base64");
          uuid = uuid.slice(0, 6);

          const lobby = await newLobby({ uuid });
          if (!lobby) {
            console.log("couldn't create lobby");
          }

          router.push(`/lobby/${uuid}`);
        }}
      >
        Create lobby
      </button>
    </div>
  );
};

export default CreateLobby;
