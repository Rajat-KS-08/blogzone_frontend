import React from "react";
import { Row, Col } from "antd";
import LeftHomeSection from "../components/HomePage_Components/LeftHomeSection";
import RightHomeSection from "../components/HomePage_Components/RightHomeSection";
import "../components/HomePage_Components/homePage.scss";

const HomePage: React.FC = () => {
  return (
    <div className="home-page" style={{ height: "100%" }}>
      <Row className="home-page-container" style={{ height: "100%" }}>
        <Col className="left-home-section" span={8} style={{ height: "100%" }}>
          <LeftHomeSection />
        </Col>
        <Col className="right-home-section" span={16} style={{ height: "100%" }}>
          <RightHomeSection />
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
