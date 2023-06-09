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
      <div
        className="flex flex-col items-center justify-center sm:w-[26rem] w-[22rem] 
          sm:h-[22rem] h-[21rem] bg-secondary rounded-md shadow-xl"
      >
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
          {({ values, handleChange, errors }) => (
            <Form className="flex flex-col sm:gap-4 gap-2 sm:mt-8 mt-3">
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
              <div className="flex flex-col sm:flex-row sm:justify-between justify-center items-center gap-2">
                <Button type="submit">Login</Button>
                <div>
                  <div>
                    Dont have an account?{" "}
                    <Link href="/register" className="text-utility sm:hidden">
                      Click here to register!
                    </Link>
                  </div>
                  <Link
                    href="/register"
                    className="text-utility hidden sm:block"
                  >
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
