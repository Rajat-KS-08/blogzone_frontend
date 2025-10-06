import React, { useEffect, useState } from "react";
import { Card, Row, Col, Avatar } from "antd";
import {
  UserOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import UserProfileForm from "./UserProfileForm";
import "./myProfile.scss";
import { ProfileSectionEnums } from "../../models/profileModels";

const tiles = [
  {
    key: "profile",
    content: (
      <div className="my-profile-widget">
        <Avatar
          shape="square"
          size={64}
          icon={<UserOutlined />}
          style={{ borderRadius: 12, marginBottom: 12 }}
        />
        <div className="widget-title-text">Profile Name</div>
        <div
          className="click-text"
          style={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            left: 0,
            textAlign: "center",
            color: "#888",
          }}
        >
          Click to edit
        </div>
      </div>
    ),
  },
  {
    key: "favorites",
    content: (
      <div className="my-favorites-widget">
        <FolderOpenOutlined
          style={{ fontSize: 40, color: "#2176FF", marginBottom: 12 }}
        />
        <div className="widget-title-text">My Fav Blogs</div>
        <div
          style={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            left: 0,
            textAlign: "center",
            color: "#888",
          }}
        >
          Click to see
        </div>
      </div>
    ),
  },
  {
    key: "myblogs",
    content: (
      <div className="my-blogs-widget">
        <FileTextOutlined
          style={{ fontSize: 40, color: "#2176FF", marginBottom: 12 }}
        />
        <div className="widget-title-text">My Blogs - 42</div>
        <div
          style={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            left: 0,
            textAlign: "center",
            color: "#888",
          }}
        >
          Click to see
        </div>
      </div>
    ),
  },
];

const ProfileWidgets: React.FC = () => {
  const [renderedContent, setRenderedContent] = useState<string | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    if (location?.state?.content) {
      setRenderedContent(location?.state?.content);
    }
 }, [location?.state?.content]);
  return (
    <>
      <div className="profile-widgets">
        <Row gutter={16} justify="center">
          {tiles.map((tile) => (
            <Col className="widget-container" key={tile.key} xs={24} sm={8}>
              <Card
                hoverable
                className="widget-card"
                onClick={() => {
                  setRenderedContent(tile.key);
                }}
              >
                {tile.content}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <div className="conditional-widget-renderer">
        {renderedContent === ProfileSectionEnums.PROFILE ? (
          <UserProfileForm setRenderedContent={setRenderedContent} />
        ) : renderedContent === ProfileSectionEnums.FAVORITES ? (
          <div>Favorites Content</div>
        ) : renderedContent === ProfileSectionEnums.MYBLOGS ? (
          <div>My Blogs Content</div>
        ) : null}
      </div>
    </>
  );
};

export default ProfileWidgets;
