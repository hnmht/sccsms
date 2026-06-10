import { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const hasAuth = (path, menuList) => {
  return menuList.some(menu => menu.path === path);
};

// Only allow users to access authorized pages.
const AuthGuard = (props) => {
  const { children } = props;
  const location = useLocation();
  const user = useSelector(state => state.user);
  // If user Object is empty, it means the user isn't logged in,
  // so navigate to the login interface
  if (!user || JSON.stringify(user) === '{}' || user.id === 0) {
    return <Navigate to="/" />;
  } else {
    // if the user doesn't have permission, navigate to page203
    if (!user.menuList || user.menuList.length === 0 || !hasAuth(location.pathname, user.menuList)) {
      return <Navigate to="/auth/page203" />
    }
  }

  return <Fragment>{children}</Fragment>;
};

export default AuthGuard;
