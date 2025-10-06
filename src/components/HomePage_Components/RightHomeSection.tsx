import React, { useState } from "react";
import { Input, Button, Modal, Upload } from "antd";
import { UploadOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import BlogFeeds from "./BlogFeeds";
import "./homePage.scss";
import { useToastApi } from "../../custom_hooks/ToastProvider";
import { getBase64 } from "../../helpers/profilePageHelpers";
import { useCreateBlogMutation } from "../../redux/services/blogApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/rootReducer";
import type { IUser } from "../../models/authModel";

const { TextArea } = Input;

const RightHomeSection: React.FC = () => {
  const [postContent, setPostContent] = useState<string>("");
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);
  const [createBlogModal, setCreateBlogModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [base64URL, setBase64URL] = useState<string | null>(null);

  const userData: IUser | null | string = useSelector(
    (state: RootState) => state?.auth?.user || ""
  );

  const [createBlog, { isLoading }] = useCreateBlogMutation();

  const toast = useToastApi();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setPostContent((prev) => prev + emojiData.emoji);
  };

  // Handle File Upload
  const handleImageUpload = async (info: any) => {
    const { file } = info;
    const rawFile = file.originFileObj || file;

    // ✅ Check file size (1MB limit)
    const isLt1M = rawFile.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      toast.error({
        content: "Image must be smaller than 1MB!",
        duration: 5,
      });
      return;
    }

    if (rawFile instanceof File) {
      //console.log("Uploaded file:", rawFile);

      setAvatarFile(rawFile);

      // Create preview URL
      const previewUrl = URL.createObjectURL(rawFile);
      setAvatarUrl(previewUrl);

      // Convert to base64
      const base64String = await getBase64(rawFile);
      console.log("Base64 string:", rawFile);
      setBase64URL(base64String);
      toast.success({
        content: `File ${rawFile?.name} has been selected!`,
        duration: 3,
      });
    }
  };

  const handlePostSubmit = async () => {
    const payload = {
      blogTitle: blogTitle || "",
      blogContent: postContent || "",
      imageUrl: base64URL || "",
      userId: (userData as IUser).user_id || "",
      profileName: (userData as IUser).profile_name || "",
      profileImage: (userData as IUser).profile_img || "",
    }
    try {
      await createBlog(payload).unwrap();
      toast.success({
        content: "Blog posted successfully!",
        duration: 5,
      });
      setCreateBlogModal(false);
    } catch (error) {
      toast.error({
        content: "Failed to post blog. Please try again.",
        duration: 5,
      });
    }
  };

  return (
    <div className="right-home-section-contents">
      {/* Post Input Container */}
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
          <Upload
            showUploadList={false}
            beforeUpload={() => false} // prevent auto upload
            onChange={handleImageUpload}
            accept="image/*"
          >
            <Button className="upload-btn" icon={<UploadOutlined />}>
              Upload Images
            </Button>
          </Upload>
          <Button className="post-blog-btn" icon={<SendOutlined />} onClick={() => setCreateBlogModal(true)}>
            Post Your Blog
          </Button>
          {postContent && (
            <p className="character-left">
              ***{3000 - postContent.length} Characters left
            </p>
          )}
        </div>
      </div>

      {/* Blog Feeds Section */}
      <div className="feeds-container">
        <BlogFeeds />
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
      {/* Create Blog Modal */}
      <Modal
        open={createBlogModal}
        onCancel={() => setCreateBlogModal(false)}
        footer={null}
        title="Create New Blog"
        centered
        width={400}
        className="create-blog-modal"
      >
        <p>Enter Blog Title</p>
        <Input type="text" placeholder="Blog Title" maxLength={150} value={blogTitle} onChange={(e) => setBlogTitle(e?.target?.value)} />
        <div>
          <Button
            type="primary"
            style={{ marginTop: 20 }}
            onClick={handlePostSubmit}
            disabled={!blogTitle.trim() || !postContent.trim()}
          >
            Post Blog
          </Button>
          <Button
            style={{ marginTop: 20, marginLeft: 10 }}
            onClick={() => setCreateBlogModal(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RightHomeSection;
