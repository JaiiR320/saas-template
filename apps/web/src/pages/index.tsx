import { Folder, Home, Settings } from "lucide-react";
import type { WorkspacePages } from "@saas-template/workspace";

function HomeView() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-normal">Home</h1>
      <p className="text-muted-foreground">Your application starts here.</p>
    </div>
  );
}

function NavigationPanel() {
  return (
    <div className="p-4">
      <p className="text-muted-foreground">Navigation placeholder</p>
    </div>
  );
}

function ActivityPanel() {
  return (
    <div className="p-4">
      <p className="text-muted-foreground">Activity placeholder</p>
    </div>
  );
}

function ProjectsView() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-normal">Projects</h1>
      <p className="text-muted-foreground">Add your project content here.</p>
    </div>
  );
}

function ProjectsPanel() {
  return (
    <div className="p-4">
      <p className="text-muted-foreground">Projects placeholder</p>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-normal">Settings</h1>
      <p className="text-muted-foreground">Add your application settings here.</p>
    </div>
  );
}

export const pages: WorkspacePages = [
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
];
