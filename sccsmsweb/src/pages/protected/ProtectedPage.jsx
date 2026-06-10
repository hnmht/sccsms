import React from "react";
import styled from "@emotion/styled";

import { Alert as MuiAlert } from "@mui/material";
import { spacing } from "@mui/system";

const Alert = styled(MuiAlert)(spacing);

function ProtectedPage() {
  return (
    <React.Fragment>
      <Alert mb={4} severity="info">
        This page is only visible by authenticated users.
      </Alert>

    </React.Fragment>
  );
}

export default ProtectedPage;
