import { Fragment,useEffect } from "react";
import { useSelector } from "react-redux";
import DownloadQR from "./DownloadQR";
import AppBar from "./AppBar";
import Introduction from "./Introduction";
import About from "./About";

const Presentation = () => {
  const user = useSelector(state => state.user);
  const isLogin = (user !== undefined && JSON.stringify(user) !== '{}' && user.id !== 0);
  return (
    <Fragment>
      <DownloadQR />
      <AppBar user={user} isLogin={isLogin} />
      <Introduction />
      <About />
    </Fragment>
  );
};
export default Presentation;
