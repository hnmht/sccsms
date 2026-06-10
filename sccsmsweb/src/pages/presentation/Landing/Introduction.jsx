import { useState, useEffect } from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { reqLandingPageInfo } from "../../../api/landingPage";

const zeroInfo = {
  sysNameDisp: "systemName",
  introText: "An open-source construction site management system that helps managers effectively implement on-site management measures.",
  file: {
    "id": 0,
    "fileUrl": `/static/img/brands/introduce.jpg`,
  }
};

// Software Introduction
const Introduction = () => {
  const [info, setInfo] = useState(zeroInfo);
  useEffect(() => {
    async function initialData() {
      let infoRes = await reqLandingPageInfo();
      let info = {};
      if (infoRes.status) {
        info = infoRes.data;
      } else {
        info = zeroInfo;
      }
      setInfo(info);
    }
    initialData();
  }, []);
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Box
      id="introduction"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        flex: 1,
        pt: 20
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          pt: { xs: 8, sm: 8 },
          pb: { xs: 8, sm: 8 },
        }}>
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignSelf: "center",
              textAlign: "center",
              fontSize: 'clamp(1.5rem, 10vw, 2rem)',
            }}
          >
            {t(info.sysNameDisp)}
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            {t(info.introText)}
          </Typography>
        </Stack>
        <Stack
          sx={{
            flex: 1,
            width: "100%",
          }}
        >
          <img
            src={info.file.fileUrl}
            alt="introduce"
            style={{
              alignSelf: "center",
              marginTop: theme.spacing(8),
              width: "75%",
              transform:"perspective(1920px) rotateX(25deg)",
              borderRadius: theme.shape.borderRadius,
              outline: "6px solid",
              outlineColor: "hsla(220,25%,80%,0.2)",
              border: "1px solid",
              borderColor: theme.palette.grey[200],
              boxShadow: "0 0 8px 12px hsla(220, 25%,80%,0.2)"
            }} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Introduction;
