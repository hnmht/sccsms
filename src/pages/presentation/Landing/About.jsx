import {
  Container,
  Link,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { author } from "../../../constants";

function Copyright() {
  const { t } = useTranslation();
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {'Copyright © '}
      <Link href="https://github.com/hnmht" target="_blank">{author}&nbsp;</Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

function About() {
  const {t} = useTranslation();
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2, sm: 2 },
        py: { xs: 2, sm: 2 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: "center", md: 'space-between' },
          pt: 2,
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Copyright />
        <Stack
          direction="row"
          justifyContent="left"
          spacing={1}
          sx={{
            display: { xs: "none", md: "flex" },
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">
            {t("slogan")}
          </Typography>
        </Stack>
      </Box>
    </Container>

  );
};

export default About;
