import Heading from "@/components/Heading";
import InputField from "@/components/InputField";
import NavBar from "@/components/Navbar";
import Wrapper from "@/components/Wrapper";
import { LoginDocument } from "@/generated/graphql";
import { Form, Formik } from "formik";
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
          onSubmit={async (values) => {
            await login({ options: values });

            router.replace("/home");
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
                <button className="w-28 h-8 bg-utility hover:opacity-75 text-white">
                  Login
                </button>
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

export default Login;
