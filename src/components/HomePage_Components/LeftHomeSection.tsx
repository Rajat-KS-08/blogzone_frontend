import React from "react";
import { Avatar, Button } from "antd";
import {
  UserOutlined,
  EditOutlined,
  HeartOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./homePage.scss";
import type { RootState } from "../../redux/rootReducer";
import type { IUser } from "../../models/authModel";
import { ProfileSectionEnums } from "../../models/profileModels";

const LeftHomeSection: React.FC = () => {
  const user: IUser = useSelector(
    (state: RootState) => state?.auth?.user as IUser || {}
  );
  const navigate = useNavigate();

  const onClickHandler = (routeContent: string) => {
    navigate("/my_profile", { state: { content: routeContent } });
  }

  return (
    <div className="left-home-section-contents">
      <Avatar className="home-page-avatar" size={120} src={user?.profile_img || ""} icon={<UserOutlined />} />
      <p className="user-name">{user?.user_name}</p>
      <p className="profile-name">{user?.profile_name}</p>
      <p className="user-bio">
        {user?.bio}
      </p>
      <div className="home-profile-btns" style={{ display: "flex", gap: 12 }}>
        <Button className="edit-btn" icon={<EditOutlined />} onClick={() => onClickHandler(ProfileSectionEnums.PROFILE)}>
          Edit Profile
        </Button>
        <Button className="fav-posts-btn" icon={<HeartOutlined />} onClick={() => onClickHandler(ProfileSectionEnums.FAVORITES)}>
          Fav Posts
        </Button>
        <Button className="my-posts-btn" icon={<PictureOutlined />} onClick={() => onClickHandler(ProfileSectionEnums.MYBLOGS)}>
          My Posts
        </Button>
      </div>
    </div>
  );
};

export default LeftHomeSection;
