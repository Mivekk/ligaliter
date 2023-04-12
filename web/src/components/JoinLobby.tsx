import { JoinLobbyDocument } from "@/generated/graphql";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";
import Heading from "./Heading";
import InputField from "./InputField";
import Button from "./Button";

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
        onSubmit={async (values, { setErrors }) => {
          const result = await joinLobby({ uuid: values.uuid });

          if (result.data?.joinLobby.error) {
            setErrors({ uuid: result.data.joinLobby.error.message });
          } else {
            router.push(`/lobby/${values.uuid}`);
          }
        }}
      >
        {({ values, handleChange, errors }) => (
          <Form className="flex flex-col">
            <InputField
              type="text"
              name="uuid"
              placeholder="xxxxxx"
              label="Lobby ID"
              value={values.uuid}
              onChange={handleChange}
              error={errors.uuid}
            />
            <div className="self-center">
              <Button type="submit">Join lobby</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default JoinLobby;
