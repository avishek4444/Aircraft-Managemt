import React from "react";

import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "react-query";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Checkbox,
  Anchor,
  Stack,
  Divider,
} from "@mantine/core";

import useSignIn from "react-auth-kit/hooks/useSignIn";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function Login(props: PaperProps) {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [searchParams] = useSearchParams();
  const navigateBack = searchParams.get("navigate");

  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 3
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async () => {
      return await axios.post("http://localhost:4000/api/users/login", {
        email: form.values.email,
        password: form.values.password,
      });
    },
    mutationKey: ["loginUser"],
    onSuccess: (data) => {
      notifications.show({
        color: "green.3",
        title: "Success",
        message: "login sucessfully.",
        icon: <IconCheck />,
      });

      signIn({
        auth: {
          token: data.data.token,
          type: "Bearer",
        },
        userState: {
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
          id: data.data.id,
        },
      });
      console.log(data);

      if (data.data.role === "client") {
        if (navigateBack && navigateBack === "true") {
          return navigate(-1);
        } else {
          return navigate("/");
        }
      } else if((data.data.role === "client")){
        return navigate("/admin");
      }else {
        return navigate("/staff");
      }
    },
    onError: (error: any) => {
      console.log(error);

      notifications.show({
        color: "red.3",
        title: "Error occured",
        message: error.response.data.message,
        icon: <IconX />,
      });
    },
  });

  const { mutate: signup, isLoading: isSignupLoading } = useMutation({
    mutationFn: async (data: any) => {
      return await axios.post("http://localhost:4000/api/users/signup", {
        email: form.values.email,
        password: form.values.password,
        name: form.values.name,
      });
    },
    mutationKey: ["registerUser"],
    onSuccess: (data) => {
      notifications.show({
        color: "green.3",
        title: "Success",
        message: "registration sucessfully!",
        icon: <IconCheck />,
      });
      form.reset();
    },
    onError: (error: any) => {
      notifications.show({
        color: "red.3",
        title: "Error occured",
        message: error.message,
        icon: <IconX />,
      });
    },
  });

  return (
    <div className="h-[80vh] flex justify-center items-center">
      <Paper
        radius="md"
        p="xl"
        maw={400}
        mx="auto"
        // mt={100}
        withBorder
        {...props}
        className="bg-[#eee]"
      >
        <Text
          size="lg"
          className="text-center text-[1.3em] font-semibold"
          fw={500}
        >
          Welcome to Aircraft Management System
        </Text>

        <Divider label={type.toUpperCase()} labelPosition="center" my="lg" />

        <form
          onSubmit={form.onSubmit(() =>
            type === "login" ? login() : signup()
          )}
        >
          <Stack>
            {type === "register" && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />

            {type === "register" && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}
