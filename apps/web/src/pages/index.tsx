import HomeOutlined from "@mui/icons-material/HomeOutlined";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { Box, Typography } from "@mui/material";
import type { WorkspacePages } from "@saas-template/workspace";

function HomeView() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Home
      </Typography>
      <Typography color="text.secondary">Your application starts here.</Typography>
    </Box>
  );
}

function NavigationPanel() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography color="text.secondary">Navigation placeholder</Typography>
    </Box>
  );
}

function ActivityPanel() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography color="text.secondary">Activity placeholder</Typography>
    </Box>
  );
}

function ProjectsView() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Projects
      </Typography>
      <Typography color="text.secondary">Add your project content here.</Typography>
    </Box>
  );
}

function ProjectsPanel() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography color="text.secondary">Projects placeholder</Typography>
    </Box>
  );
}

function SettingsView() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <Typography color="text.secondary">Add your application settings here.</Typography>
    </Box>
  );
}

export const pages: WorkspacePages = [
  {
    id: "home",
    label: "Home",
    icon: <HomeOutlined />,
    panels: {
      left: { title: "Navigation", content: NavigationPanel },
      center: { content: HomeView },
      right: { title: "Activity", content: ActivityPanel },
    },
  },
  {
    id: "projects",
    label: "Projects",
    icon: <FolderOutlined />,
    panels: {
      left: { title: "Projects", content: ProjectsPanel },
      center: { content: ProjectsView },
    },
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsOutlined />,
    placement: "bottom",
    panels: { center: { content: SettingsView } },
  },
];
