import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavMenu } from "tag-client/components/navbar/navmenu";
import { clickEvent } from "tag-client-test/util/mockMouseEvents";


describe("<NavMenu />", () => {
  describe("NavMenu items", () => {
    beforeEach(() => {
      render(
        <Router>
          <NavMenu />
        </Router>
      );

      const navMenuButton: HTMLElement[] = screen.queryAllByLabelText(
        "nav-menu-button"
      );
      userEvent.click(navMenuButton[0], clickEvent);
    });

    it("should direct to the profile page", () => {
      const profileButton: HTMLElement = screen.getByText("My Profile");

      userEvent.click(profileButton, clickEvent);

      expect(window.location.pathname).toBe("/profile/@me");
    });

    it("should direct to the account page", () => {
      const accountButton: HTMLElement = screen.getByText("My Account");

      userEvent.click(accountButton, clickEvent);

      expect(window.location.pathname).toBe("/account");
    });
  });
});
