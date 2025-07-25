import React, { useState } from "react";
import { Input, Button, Modal } from "antd";
import { UploadOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import "./homePage.scss";

const { TextArea } = Input;

const RightHomeSection: React.FC = () => {
  const [postContent, setPostContent] = useState<string>("");
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setPostContent((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="right-home-section-contents">
      <div className="posts-container">
        <TextArea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Got something to say? Start penning down your blog here!"
          style={{ resize: "none", height: 120 }}
          maxLength={3000}
          className="post-textarea"
        />

        <div className="post-btns">
          <Button
            className="emoji-btn"
            icon={<SmileOutlined />}
            onClick={() => setIsEmojiModalOpen(true)}
          >
            Emoji
          </Button>
          <Button className="upload-btn" icon={<UploadOutlined />}>
            Upload Images
          </Button>
          <Button className="post-blog-btn" icon={<SendOutlined />}>
            Post Your Blog
          </Button>
          {postContent && (
            <p className="character-left">
              ***{3000 - postContent.length} Characters left
            </p>
          )}
        </div>
      </div>

      {/* Emoji Picker Modal */}
      <Modal
        open={isEmojiModalOpen}
        onCancel={() => setIsEmojiModalOpen(false)}
        footer={null}
        title="Pick an Emoji 😄"
        centered
        width={400}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </Modal>

      <div className="feeds-container"></div>
    </div>
  );
};

export default RightHomeSection;
