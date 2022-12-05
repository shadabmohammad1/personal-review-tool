import { Grid } from "@material-ui/core";
import React from "react";

import Options from "./Options";
import PreviewSwitcher from "./PreviewSwitcher";

export default function Header() {
  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item md={4} />
      <Grid item md={4}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item md={12}>
            <PreviewSwitcher />
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={4}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Options />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
