// Imports from React, React Router, MUI, and ProSidebar
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tokens } from "../../theme"; // Theme tokens for light/dark mode
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  HomeOutlined as HomeOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  MenuOutlined as MenuOutlinedIcon,
} from "@mui/icons-material";
import { Sidebar as proSidebar, Menu, MenuItem } from "react-pro-sidebar";

const Sidebar = () => {
  const theme = useTheme(); // Access current theme (light/dark)
  const colors = tokens(theme.palette.mode); // Get color tokens based on mode

  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state
  const [user, setUser] = useState({ name: "", email: "" }); // User data from session

  // Load user data from sessionStorage on component mount
  useEffect(() => {
    const name = sessionStorage.getItem("userName");
    const email = sessionStorage.getItem("userEmail");
    if (name && email) {
      setUser({ name, email });
    }
  }, []);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        backgroundColor: "#24763a29", // Light green tint
        width: "100%",
        height: "1000px",
      }}
    >
      {/* Main Sidebar container */}
      <proSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* Collapse Toggle Button */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {/* Show collapse icon only when expanded */}
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3"></Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* Profile Section (only visible when expanded and user is loaded) */}
          {!isCollapsed && user.name && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Avatar
                  alt="User Avatar"
                  // src="../../assets/user.png" // Optional avatar image
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center" mt={2}>
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  fontWeight="bold"
                >
                  {user.name}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Navigation Links */}
          <Box mt={3} paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* Only visible to admin */}
            {user.name === "Admin" && (
              <>
                <Link to="/dashboard" style={{ textDecoration: "none" }}>
                  <Tooltip title="Dashboard">
                    <IconButton>
                      <HomeOutlinedIcon />
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "13px",
                          marginLeft: "17px",
                          color: "inherit",
                        }}
                      >
                        Dashboard
                      </Typography>
                    </IconButton>
                  </Tooltip>
                </Link>

                <Link to="/analysis" style={{ textDecoration: "none" }}>
                  <Tooltip title="Analysis">
                    <IconButton>
                      <PersonOutlinedIcon />
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "13px",
                          marginLeft: "17px",
                          color: "inherit",
                        }}
                      >
                        Analysis
                      </Typography>
                    </IconButton>
                  </Tooltip>
                </Link>
              </>
            )}

            {/* Section heading */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>

            {/* Feedback page - accessible by all */}
            <Link to="/feedback" style={{ textDecoration: "none" }}>
              <Tooltip title="Feedback Page">
                <IconButton>
                  <PersonOutlinedIcon />
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "13px",
                      marginLeft: "17px",
                      color: "inherit",
                    }}
                  >
                    FEEDBACK
                  </Typography>
                </IconButton>
              </Tooltip>
            </Link>
          </Box>
        </Menu>
      </proSidebar>
    </Box>
  );
};

export default Sidebar;
