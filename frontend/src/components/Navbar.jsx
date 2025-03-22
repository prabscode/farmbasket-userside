import React, { useEffect, useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const API_URL = "http://localhost:5000";

const menuItems = [
  { title: "Home", path: "/" },
  { title: "Products", path: "/products" },
  { title: "Cart", path: "/cart" },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleMenuItemClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <Menu
      open={isMenuOpen}
      handler={setIsMenuOpen}
      dismiss={{ outsidePress: true }}
    >
      <MenuHandler>
        <Typography as="div" variant="small" className="font-medium">
          <ListItem
            className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
            selected={isMenuOpen || isMobileMenuOpen}
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
            onClick={() => setIsMobileMenuOpen((cur) => !cur)}
          >
            Products
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </ListItem>
        </Typography>
      </MenuHandler>
      <MenuList
        className="rounded-xl shadow-lg"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <MenuItem onClick={() => handleMenuItemClick("/products")}>Products</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/bundles")}>Bundles</MenuItem>
      </MenuList>
    </Menu>
  );
}

function NavList() {
  const navigate = useNavigate();
  
  const handleNavItemClick = (path) => {
    navigate(path);
  };

  return (
    <List className="mb-6 mt-4 p-0 lg:mb-0 lg:mt-0 lg:flex-row lg:p-1">
      {menuItems.map(({ title, path }, key) => (
        <Typography
          key={key}
          as="div"
          variant="small"
          color="blue-gray"
          className="font-medium"
        >
          {title === "Products" ? (
            <NavListMenu />
          ) : (
            <ListItem 
              className="flex items-center gap-2 py-2 pr-4 hover:bg-gray-100 transition-colors rounded cursor-pointer"
              onClick={() => handleNavItemClick(path)}
            >
              {title}
            </ListItem>
          )}
        </Typography>
      ))}
    </List>
  );
}

export function NavbarMenu() {
  const [openNav, setOpenNav] = React.useState(false);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [dbUser, setDbUser] = useState(null);
  const navigate = useNavigate();

  // Generate a simple user ID if authenticated using Auth0's sub
  const userId = isAuthenticated ? `user_${user?.sub?.split('|')[1] || Math.random().toString(36).substring(2, 10)}` : null;

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  // Save user to database after authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      const saveUserToDatabase = async () => {
        try {
          // Prepare user data
          const userData = {
            userId: userId,
            name: user.name,
            email: user.email,
            picture: user.picture
          };
          // Send to backend
          const response = await axios.post(`${API_URL}/api/users`, userData);
          console.log('User saved to database:', response.data);
          setDbUser(response.data.user);
          // Save the crucial user information to localStorage
          localStorage.setItem("userId", userId);
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userName", user.name);
          console.log('User info saved to localStorage');
        } catch (error) {
          console.error('Error saving user to database:', error);
        }
      };
      saveUserToDatabase();
    } else {
      // Clear localStorage when logged out
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
    }
  }, [isAuthenticated, user, userId]);

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <Navbar className="mx-auto px-4 py-2 shadow-md">
      <div className="flex items-center justify-between text-gray-900">
        <Typography
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2"
          onClick={handleLogoClick}
        >
          FarmBasket
        </Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <div className="hidden gap-2 lg:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Typography variant="small" className="font-medium">
                {user.name}
                <span className="text-xs text-gray-500 ml-1">({userId})</span>
              </Typography>
              <Button
                variant="outlined"
                size="sm"
                className="shadow-sm hover:shadow"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Button
                size="sm"
                className="shadow-sm hover:shadow"
                onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                size="sm"
                className="shadow-sm hover:shadow"
                onClick={() => loginWithRedirect()}
              >
                Log In
              </Button>
            </>
          )}
        </div>
        <IconButton
          variant="text"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav} className="lg:hidden">
        <NavList />
        <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
          {isAuthenticated ? (
            <div className="flex flex-col w-full gap-2">
              <Typography variant="small" className="font-medium text-center">
                {user.name}
                <span className="text-xs text-gray-500 ml-1">({userId})</span>
              </Typography>
              <Button
                variant="outlined"
                size="sm"
                fullWidth
                className="shadow-sm"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Button
                size="sm"
                fullWidth
                className="shadow-sm"
                onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                size="sm"
                fullWidth
                className="shadow-sm"
                onClick={() => loginWithRedirect()}
              >
                Log In
              </Button>
            </>
          )}
        </div>
      </Collapse>
    </Navbar>
  );
}