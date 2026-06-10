import styled from "@emotion/styled";
import {
  Grid,
  Link
} from "@mui/material";
import { author } from "../../constants";
const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(0.25)}
    ${(props) => props.theme.spacing(2)};
  background: ${(props) => props.theme.footer.background};
  position: relative;
`;
function Footer() {
  return (
    <Wrapper>
      <Grid container spacing={2}>
        <Grid item m={2}>
          {'Copyright © '}
          <Link href="https://github.com/hnmht" target="_blank">{author}&nbsp;</Link>
          {new Date().getFullYear()}
        </Grid>
      </Grid>
    </Wrapper>
  );
}

export default Footer;
