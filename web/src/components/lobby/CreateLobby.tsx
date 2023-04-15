import React from "react";
import Heading from "../Heading";
import { v4 } from "uuid";
import { useRouter } from "next/router";
import { useMutation } from "urql";
import { NewLobbyDocument } from "@/generated/graphql";
import Button from "../Button";

const CreateLobby: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, newLobby] = useMutation(NewLobbyDocument);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center">
        <Heading>Create lobby!</Heading>
      </div>
      <Button
        onClick={async () => {
          const uuid = v4().slice(0, 6);

          const lobby = await newLobby({ uuid });
          if (!lobby) {
            console.log("couldn't create lobby");
          }

          router.push(`/lobby/${uuid}`);
        }}
      >
        Create lobby
      </Button>
    </div>
  );
};

export default CreateLobby;
