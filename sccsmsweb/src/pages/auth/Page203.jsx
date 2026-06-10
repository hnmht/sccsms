import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Button as MuiButton, Typography } from "@mui/material";
import { spacing } from "@mui/system";
import { useTranslation } from "react-i18next";
const Button = styled(MuiButton)(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)};
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

const Page203 = () => {
  const {t} = useTranslation();
  return (
    <Wrapper>
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        203
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        {t("page203")}
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="secondary"
        mt={2}
      >
        {t("returnHomepage")}
      </Button>
    </Wrapper>
  );
};

export default Page203;
