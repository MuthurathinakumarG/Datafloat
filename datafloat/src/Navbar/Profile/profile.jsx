import React, { useEffect, useState } from "react";
import { Avatar, Menu, MenuItem, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
const UserInfoCard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ name: "", email: "", phone: "" });

  // Load user info from sessionStorage on component mount
  useEffect(() => {
    const name = sessionStorage.getItem("userName");
    const email = sessionStorage.getItem("userEmail");
    const phone = sessionStorage.getItem("userPhone");

    if (name && email && phone) {
      setUser({ name, email, phone });
    }
  }, []);

  // Handle avatar click to open menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {/* Avatar button to open menu */}
      <Avatar
        alt="User Avatar"
        onClick={handleClick}
        sx={{ cursor: "pointer", bgcolor: "primary.main" }}
      />

      {/* Dropdown menu with user info */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 250,
            padding: 2,
          },
        }}
      >
        {/* User Avatar inside Menu */}
        <MenuItem sx={{ justifyContent: "center" }}>
          <Avatar alt="User Avatar" />
        </MenuItem>

        {/* Name */}
        <MenuItem>
          <PersonOutlinedIcon sx={{ marginRight: 1 }} />
          <Typography variant="subtitle1">{user.name}</Typography>
        </MenuItem>

        {/* Email */}
        <MenuItem>
          <EmailOutlinedIcon sx={{ marginRight: 1 }} />
          <Typography variant="body2">{user.email}</Typography>
        </MenuItem>
        {/* Phone  */}
        <MenuItem>
          <PhoneIcon sx={{ marginRight: 1 }} />
          <Typography variant="body2">{user.phone}</Typography>
        </MenuItem>

        {/* Logout button */}
        <MenuItem sx={{ justifyContent: "center" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="success">
              LOGOUT
            </Button>
          </Link>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserInfoCard;
