import Button from "@/components/Button";
import Heading from "@/components/Heading";
import InputField from "@/components/lobby/InputField";
import Wrapper from "@/components/Wrapper";
import { LoginDocument } from "@/generated/graphql";
import { createUrqlClient } from "@/utils/createUrqlClient";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useMutation(LoginDocument);

  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center w-[26rem] h-[22rem] bg-secondary rounded-md shadow-xl">
        <Heading>Login</Heading>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({ options: values });

            if (response.data?.login.error) {
              const errorMap: Record<string, string> = {};
              errorMap[response.data.login.error.field.toString()] =
                response.data.login.error.message.toString();

              setErrors(errorMap);
            } else {
              router.replace("/home");
            }
          }}
        >
          {({ values, handleChange, errors, isSubmitting }) => (
            <Form className="flex flex-col gap-4 mt-8">
              <InputField
                type="text"
                name="username"
                placeholder="username"
                label="Username"
                value={values.username}
                onChange={handleChange}
                error={errors.username}
              />
              <InputField
                type="password"
                name="password"
                placeholder="password"
                label="Password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
              />
              <div className="flex justify-between">
                <Button type="submit">Login</Button>
                <div>
                  <div>Don't have an account?</div>
                  <Link href="/register" className="text-utility">
                    Click here to register!
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
