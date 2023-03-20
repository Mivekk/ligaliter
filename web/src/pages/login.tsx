import Heading from "@/components/Heading";
import InputField from "@/components/InputField";
import Wrapper from "@/components/Wrapper";
import { LoginDocument } from "@/generated/graphql";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();
  const [, login] = useMutation(LoginDocument);

  return (
    <Wrapper>
      <div className="flex w-full justify-center">
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values) => {
            const response = await login({ options: values });
            console.log(response);

            router.push("/");
          }}
        >
          {({ values, handleChange }) => (
            <Form className="flex flex-col gap-4 mt-8">
              <Heading>Login</Heading>
              <InputField
                type="text"
                name="username"
                placeholder="mivekk"
                label="Username"
                value={values.username}
                onChange={handleChange}
              />
              <InputField
                type="password"
                name="password"
                placeholder="mivekk"
                label="Password"
                value={values.password}
                onChange={handleChange}
              />
              <button type="submit" className="w-28 h-8 bg-blue-400 text-white">
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Wrapper>
  );
};

export default Login;
