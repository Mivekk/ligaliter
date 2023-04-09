import Heading from "@/components/Heading";
import InputField from "@/components/InputField";
import NavBar from "@/components/Navbar";
import { RegisterDocument } from "@/generated/graphql";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";

const Register: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, register] = useMutation(RegisterDocument);

  return (
    <>
      <NavBar />
      <div className="flex w-full h-screen items-center justify-center bg-plt-four">
        <div className="flex flex-col items-center justify-center w-[26rem] h-[26rem] bg-plt-three rounded-md">
          <Heading>Register</Heading>
          <Formik
            initialValues={{ username: "", email: "", password: "" }}
            onSubmit={async (values) => {
              await register({ options: values });

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
                  type="text"
                  name="email"
                  placeholder="email"
                  label="Email"
                  value={values.email}
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
                    Register
                  </button>
                  <div>
                    <div>Already have an account?</div>
                    <Link href="/login" className="text-plt-one">
                      Click here to login!
                    </Link>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Register;
