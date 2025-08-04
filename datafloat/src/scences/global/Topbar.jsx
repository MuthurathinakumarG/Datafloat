// Import required dependencies from MUI and React
import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme"; // Custom theming setup
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import UserInfoCard from "../../Navbar/Profile/profile"; // Custom user profile component

const Topbar = () => {
  const theme = useTheme(); // Hook to get current theme (light/dark)
  const colors = tokens(theme.palette.mode); // Get color tokens for current theme
  const colorMode = useContext(ColorModeContext); // Context to toggle light/dark mode

  return (
    <Box
      display="flex"
      height="50px"
      p={2}
      width="1200px"
      sx={{ backgroundColor: "#d8f2f9ff" }} // Light blue background
    >
      {/* Optional Search bar section (currently commented out) */}
      <Box
        display="flex"
        borderRadius="3px"
        width="15%"
        sx={{ backgroundColor: "#d8f2f9ff" }}
      >
        {/* Placeholder for search icon or input */}
        <IconButton type="button" sx={{ p: 1, color: "black" }}>
          {/* <SearchIcon /> */}
        </IconButton>
      </Box>

      {/* Right section: icons and user info */}
      <Box display="flex" justifyContent="right" width="85%">
        {/* Optional icons, commented out for now */}
        <IconButton>
          {/* <SettingsOutlinedIcon /> */}
        </IconButton>
        <IconButton>
          {/* <SettingsOutlinedIcon /> */}
        </IconButton>
        <IconButton>
          {/* <SettingsOutlinedIcon /> */}
        </IconButton>
        <IconButton>
          {/* <SettingsOutlinedIcon /> */}
        </IconButton>

        {/* Toggle for Light/Dark Mode */}
        <IconButton onClick={colorMode.toggleColorMode} sx={{ color: "gray" }}>
          {theme.palette.mode === "light" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        {/* Optional icons like notifications/settings, currently commented out */}
        <IconButton>
          {/* <NotificationsOutlinedIcon /> */}
        </IconButton>
        <IconButton>
          {/* <SettingsOutlinedIcon /> */}
        </IconButton>

        {/* Custom user profile card (avatar, name, etc.) */}
        <IconButton>
          <UserInfoCard />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
