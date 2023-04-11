import { JoinLobbyDocument } from "@/generated/graphql";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";
import Heading from "./Heading";
import InputField from "./InputField";

const JoinLobby: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, joinLobby] = useMutation(JoinLobbyDocument);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <Heading>Join lobby!</Heading>
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
          <Form className="flex flex-col">
            <InputField
              type="text"
              name="uuid"
              placeholder="xxxxxx"
              label="Lobby ID"
              value={values.uuid}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="w-36 h-10 rounded-xl bg-utility hover:opacity-75 text-white mt-4 self-center"
            >
              Join lobby
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default JoinLobby;
