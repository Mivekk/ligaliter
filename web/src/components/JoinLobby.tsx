import { JoinLobbyDocument } from "@/generated/graphql";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction } from "react";
import { useMutation } from "urql";
import Heading from "./Heading";
import InputField from "./InputField";

interface JoinLobbyProps {
  setSelectLobby: Dispatch<SetStateAction<boolean>>;
}

const JoinLobby: React.FC<JoinLobbyProps> = ({ setSelectLobby }) => {
  const router = useRouter();
  const [, joinLobby] = useMutation(JoinLobbyDocument);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <Heading>Join lobby</Heading>
      </div>
      <Formik
        initialValues={{ uuid: "" }}
        onSubmit={async (values) => {
          const result = await joinLobby({ uuid: values.uuid });

          if (result.data?.joinLobby.error) {
            // display error
          } else {
            router.push(`/lobby/${values.uuid}`);
          }
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <InputField
              type="text"
              name="uuid"
              placeholder="xxxxx-xxx-xxxxx-xxxx"
              label="Lobby UUID"
              value={values.uuid}
              onChange={handleChange}
            />
            <div className="flex mt-1.5 justify-between">
              <button
                type="submit"
                className="w-28 h-8 bg-plt-one hover:opacity-75 text-white"
              >
                Join
              </button>
              <div
                className="text-plt-one cursor-pointer"
                onClick={() => setSelectLobby(true)}
              >
                Go back
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default JoinLobby;
