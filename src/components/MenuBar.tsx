import React from "react";
import { Container, Navbar, NavDropdown } from "react-bootstrap";
import { RunButton } from "./RunButton";

export const MenuBar: React.FC<{}> = () => {
  return (
    <Navbar>
      <Container fluid className="MenuBar">
        <Navbar.Brand>
          <RunButton />
        </Navbar.Brand>
        <NavDropdown title="File">
          <NavDropdown.Item>New</NavDropdown.Item>
          <NavDropdown.Item>Open</NavDropdown.Item>
          <NavDropdown.Item>Upload</NavDropdown.Item>
          <NavDropdown.Item>Make a copy</NavDropdown.Item>
          <NavDropdown.Item>Download</NavDropdown.Item>
        </NavDropdown>
      </Container>
    </Navbar>
  );
};
