import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Button, Typography, Container, Box, Stack } from "@mui/material";
import Copyright from "./Copyright";
import configData from "../config/config.json";

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

export default function Page404() {
  return (
    <Container>
      <ContentStyle sx={{ textAlign: "center", alignItems: "center" }}>
        <Typography variant="h3" paragraph>
          Sorry, Page not found!
        </Typography>

        <Box
          component="img"
          src="/static/illustrations/illustration_404.svg"
          sx={{ height: 260, mx: "auto", my: { xs: 5, sm: 10 } }}
        />

        <Button
          to={configData.LOGIN_URL}
          size="large"
          variant="contained"
          component={RouterLink}
        >
          Go to Home
        </Button>

        <Stack spacing={3} sx={{ mt: 5 }}>
          <Copyright />
        </Stack>
      </ContentStyle>
    </Container>
  );
}
