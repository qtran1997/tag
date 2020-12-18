import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavLogo } from "tag-client/components/navbar/navlogo";
import { clickEvent } from "tag-client-test/util/mockMouseEvents";

describe("<NavLogo />", () => {
  it("should navigate to the home screen", () => {
    const { queryAllByLabelText } = render(
      <Router>
        <NavLogo />
      </Router>
    );

    const navLogoButton: HTMLElement[] = queryAllByLabelText("home-button");

    userEvent.click(navLogoButton[0], clickEvent);
  });
});
