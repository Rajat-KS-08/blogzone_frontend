import { Layout, Button, Space, Drawer, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { logoutUser } from "../../apiServices/authService";
import { logout } from "../../redux/slices/authReducer";
import logo from "../../assets/logo.png";
import "./layout.scss";
import { useDispatch } from "react-redux";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      // window.location.href = "/login"; // redirect to login page
      sessionStorage.clear();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = (
    <Space direction="vertical" className="drawer-menu" size="large">
      <Link to="/">
        <HomeOutlined /> Home
      </Link>
      <Link to="/my_profile/123">
        <UserOutlined /> My Profile
      </Link>
      <Link to="/settings">
        <SettingOutlined /> Settings
      </Link>
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        danger
      >
        Logout
      </Button>
    </Space>
  );

  return (
    <>
      <Header className="navbar">
        <div className="left-items">
          <Link to="/">
            <img src={logo} alt="Logo" style={{ height: 40 }} />
          </Link>
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            className="navbar-search-input"
          />
        </div>

        {/* Desktop View */}
        <Space className="right-items desktop-nav" size="middle" align="center">
          <Space className="nav-items" size="large">
            <Link to="/" className="nav-link">
              <HomeOutlined /> Home
            </Link>
            <Link to="/my_profile/" className="nav-link">
              <UserOutlined /> My Profile
            </Link>
            <Link to="/settings" className="nav-link">
              <SettingOutlined /> Settings
            </Link>
          </Space>

          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
            className="logout-button"
          >
            Logout
          </Button>
        </Space>

        {/* Mobile Hamburger */}
        <Button
          className="mobile-nav-toggle"
          icon={<MenuOutlined />}
          type="text"
          onClick={() => setDrawerOpen(true)}
        />
      </Header>

      {/* Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        closable
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {navItems}
      </Drawer>
    </>
  );
};

export default Navbar;
