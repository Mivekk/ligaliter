import Heading from "@/components/Heading";
import InputField from "@/components/InputField";
import Wrapper from "@/components/Wrapper";
import { Formik, Form } from "formik";
import React from "react";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  return (
    <Wrapper>
      <div className="flex w-full justify-center">
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values) => {
            console.log(values);
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
              <button type="submit" className="w-28 h-8 bg-lime-400 text-white">
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
