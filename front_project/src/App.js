import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Population from "./component/Population";
import Areas from "./component/Areas";
import Home from "./component/Home";
import Layout from "./component/Layout";
import styled from "styled-components";
import Description from "./component/Description";

import Review from "./component/Review";

const BackgroundWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(https://img.freepik.com/free-vector/clean-black-world-map-silhouette-style-template-design_1017-46154.jpg);
  background-repeat: no-repeat;
  background-position: center 30px;
  background-size: contain;
  background-color: white;
  opacity: 0.2;
  z-index: 0;

  @media (max-width: 768px) {
    background-size: cover;
    background-position: center;
    height: 50vh;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
   @media (max-width: 768px) {
    padding: 10px;
`;

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const content = (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/population" element={<Population />} />
        <Route path="/areas" element={<Areas />} />
        <Route
          path="/population/description/:countryName"
          element={<Description />}
        />
        <Route
          path="/areas/description/:countryName"
          element={<Description />}
        />
        <Route path="/review" element={<Review />} />
      </Route>
    </Routes>
  );

  return isHome ? (
    <BackgroundWrapper>
      <BackgroundImage />
      <Content>{content}</Content>
    </BackgroundWrapper>
  ) : (
    content
  );
};

export default App;
