import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/login-page";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Northgate Academy Portal" },
      {
        name: "description",
        content:
          "Institutional login portal for students, faculty, and administrative staff.",
      },
    ],
  }),
  component: LoginPage,
});
