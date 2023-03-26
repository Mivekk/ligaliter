import Heading from "@/components/Heading";
import InputField from "@/components/InputField";
import { LoginDocument } from "@/generated/graphql";
import { Formik, Form } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();
  const [, login] = useMutation(LoginDocument);

  return (
    <div className="flex w-full h-screen items-center justify-center bg-plt-four">
      <div className="flex flex-col items-center justify-center w-[26rem] h-[22rem] bg-plt-three rounded-md">
        <Heading>Login</Heading>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values) => {
            await login({ options: values });

            router.replace("/");
          }}
        >
          {({ values, handleChange }) => (
            <Form className="flex flex-col gap-4 mt-8">
              <InputField
                type="text"
                name="username"
                placeholder="username"
                label="Username"
                value={values.username}
                onChange={handleChange}
              />
              <InputField
                type="password"
                name="password"
                placeholder="password"
                label="Password"
                value={values.password}
                onChange={handleChange}
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="w-28 h-8 bg-plt-one hover:opacity-75 text-white"
                >
                  Login
                </button>
                <div>
                  <div>Don't have an account?</div>
                  <Link href="/register" className="text-plt-one">
                    Click here to register!
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
