import React from "react";
import { render, screen } from "@testing-library/react";

import Navbar from "tag-client/components/navbar/Navbar";

import { BrowserRouter as Router } from "react-router-dom";

describe("<Navbar />", () => {
  const { getByText, queryAllByLabelText } = render(
    <Router>
      <Navbar />
    </Router>
  );

  it("should render the logo", () => {
    getByText("TAG");
  });

  it("should render the menu", () => {
    queryAllByLabelText("nav-menu-button");
  });
});
