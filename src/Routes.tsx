import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "components/Home";

import theme from "./theme";

function BaseRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Hotspring</div>} />
      <Route
        path="/preview/"
        element={
          <ThemeProvider theme={theme}>
            <Home />
          </ThemeProvider>
        }
      />
    </Routes>
  );
}

export default BaseRoutes;
