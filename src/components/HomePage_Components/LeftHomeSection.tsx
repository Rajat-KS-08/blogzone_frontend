import React from 'react';
import { Avatar, Button } from 'antd';
import { UserOutlined, EditOutlined, HeartOutlined, PictureOutlined } from '@ant-design/icons';
import "./homePage.scss";

const LeftHomeSection: React.FC = () => {
  return (
    <div className='left-home-section-contents'>
      <Avatar className='home-page-avatar' size={120} icon={<UserOutlined />} />
      <p className='user-name'>Ruben Pedro</p>
      <p className='profile-name'>ruben_pedor.08-28</p>
      <p className='user-bio'>Bio of the user goes here. This is a short description about the user.</p>
      <div className='home-profile-btns' style={{ display: 'flex', gap: 12 }}>
        <Button className='edit-btn' icon={<EditOutlined />}>Edit Profile</Button>
        <Button className='fav-posts-btn' icon={<HeartOutlined />}>Fav Posts</Button>
        <Button className='my-posts-btn' icon={<PictureOutlined />}>My Posts</Button>
      </div>
    </div>
  )
}

export default LeftHomeSection;
