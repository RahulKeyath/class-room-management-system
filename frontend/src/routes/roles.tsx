import { createFileRoute } from "@tanstack/react-router";
import { RolesManager } from "@/modules/roles/components/roles-manager";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "Roles & Access Control — Northgate Academy" },
      {
        name: "description",
        content:
          "Institutional role management, permissions matrix, and portal access authorization.",
      },
    ],
  }),
  component: RolesPage,
});

function RolesPage() {
  return <RolesManager />;
}
