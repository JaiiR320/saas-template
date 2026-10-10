import { Folder, Home, Settings } from "lucide-react";
import type { WorkspacePages } from "@saas-template/workspace";

function HomeView() {
  return (
    <div className="flex flex-col gap-2 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
      <p className="max-w-prose text-sm leading-6 text-muted-foreground">
        Your application starts here.
      </p>
    </div>
  );
}

function NavigationPanel() {
  return (
    <div className="p-4">
      <p className="text-sm leading-6 text-muted-foreground">Navigation placeholder</p>
    </div>
  );
}

function ActivityPanel() {
  return (
    <div className="p-4">
      <p className="text-sm leading-6 text-muted-foreground">Activity placeholder</p>
    </div>
  );
}

function ProjectsView() {
  return (
    <div className="flex flex-col gap-2 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      <p className="max-w-prose text-sm leading-6 text-muted-foreground">
        Add your project content here.
      </p>
    </div>
  );
}

function ProjectsPanel() {
  return (
    <div className="p-4">
      <p className="text-sm leading-6 text-muted-foreground">Projects placeholder</p>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="flex flex-col gap-2 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="max-w-prose text-sm leading-6 text-muted-foreground">
        Add your application settings here.
      </p>
    </div>
  );
}

export const pages = [
  {
    id: "home",
    label: "Home",
    icon: <Home aria-hidden="true" size={24} />,
    panels: {
      left: { title: "Navigation", content: NavigationPanel },
      center: { content: HomeView },
      right: { title: "Activity", content: ActivityPanel },
    },
  },
  {
    id: "projects",
    label: "Projects",
    icon: <Folder aria-hidden="true" size={24} />,
    panels: {
      left: { title: "Projects", content: ProjectsPanel },
      center: { content: ProjectsView },
    },
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings aria-hidden="true" size={24} />,
    placement: "bottom",
    panels: { center: { content: SettingsView } },
  },
] as const satisfies WorkspacePages;
