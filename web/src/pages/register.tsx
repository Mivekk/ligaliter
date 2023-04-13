import Button from "@/components/Button";
import Heading from "@/components/Heading";
import InputField from "@/components/InputField";
import Wrapper from "@/components/Wrapper";
import { RegisterDocument } from "@/generated/graphql";
import { createUrqlClient } from "@/utils/createUrqlClient";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";

const Register: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, register] = useMutation(RegisterDocument);

  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center w-[26rem] h-[26rem] bg-secondary rounded-md shadow-xl">
        <Heading>Register</Heading>
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({ options: values });

            if (response.data?.register.error) {
              const errorMap: Record<string, string> = {};
              errorMap[response.data.register.error.field.toString()] =
                response.data.register.error.message.toString();

              setErrors(errorMap);
            } else {
              router.replace("/home");
            }
          }}
        >
          {({ values, handleChange, errors }) => (
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
                type="text"
                name="email"
                placeholder="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
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
                <Button type="submit">Register</Button>
                <div>
                  <div>Already have an account?</div>
                  <Link href="/login" className="text-utility">
                    Click here to login!
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

export default withUrqlClient(createUrqlClient)(Register);
