import React, { useState, useEffect } from "react";
import { useGetBlogsQuery } from "../../redux/services/blogApi";
import {
  List,
  Card,
  Typography,
  Image,
  Space,
  notification,
  Avatar,
  Carousel,
} from "antd";
import { LikeOutlined, DislikeOutlined, UserOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { PacmanLoader } from "react-spinners";
import "./homePage.scss";

const { Text, Title, Paragraph } = Typography;

interface BlogItem {
  id: string | number;
  blogTitle: string;
  blogContent: string;
  imageUrl?: string | string[];
  likeCount?: number;
  dislikeCount?: number;
  createdAt?: string;
  authorName?: string;
}

const BlogFeeds: React.FC = () => {
  const { data: blogData, isLoading, error } = useGetBlogsQuery();
  const [displayedBlogs, setDisplayedBlogs] = useState<BlogItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 100;

  // Show error notification if there's an error fetching blogs
  useEffect(() => {
    if (error) {
      notification.error({
        message: "Error Loading Blogs",
        description:
          "There was a problem fetching the blog data. Please try again later.",
        placement: "topRight",
        duration: 4,
      });
    }
  }, [error]);

  // When blogData arrives or changes, initialize state
  useEffect(() => {
    if (blogData && blogData.length > 0) {
      const initialItems = blogData.slice(0, ITEMS_PER_PAGE);
      setDisplayedBlogs(initialItems);
      setHasMore(blogData.length > ITEMS_PER_PAGE);
    } else {
      setDisplayedBlogs([]);
      setHasMore(false);
    }
  }, [blogData]);

  // Fetch more blogs on scroll (using functional updater)
  const fetchMoreBlogs = () => {
    if (!blogData) return;
    setDisplayedBlogs((prevBlogs) => {
      const currentLength = prevBlogs.length;
      const nextItems = blogData.slice(
        currentLength,
        currentLength + ITEMS_PER_PAGE
      );
      const newBlogs = [...prevBlogs, ...nextItems];
      setHasMore(newBlogs.length < blogData.length); // Always update in sync
      return newBlogs;
    });
  };

  if (isLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 60,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PacmanLoader color="#2176FF" size={25} />
      </div>
    );
  }

  return (
    <div style={{ padding: "0 16px" }}>
      <InfiniteScroll
        dataLength={displayedBlogs.length}
        next={fetchMoreBlogs}
        hasMore={hasMore}
        loader={
          <div
            style={{
              textAlign: "center",
              padding: 16,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PacmanLoader color="#2176FF" size={20} />
          </div>
        }
        endMessage={
          <p style={{ textAlign: "center", marginTop: 16 }}>
            <b>No more blogs to show.</b>
          </p>
        }
      >
        <List
          itemLayout="vertical"
          size="large"
          dataSource={displayedBlogs}
          renderItem={(item: BlogItem) => {
            const images: string[] =
              typeof item.imageUrl === "string"
                ? [item.imageUrl]
                : item.imageUrl || [];

            return (
              <List.Item key={item.id}>
                <Card hoverable>
                  <div style={{ display: "flex", gap: 20 }}>
                    {/* Left Column - Images */}
                    {images.length > 0 && (
                      <div
                        style={{
                          width: "250px",
                          maxHeight: "220px",
                          overflow: "hidden",
                        }}
                      >
                        {images.length === 1 ? (
                          <Image
                            src={images[0]}
                            alt="Blog image"
                            fallback="https://via.placeholder.com/250x150?text=No+Image"
                            preview={false}
                            style={{
                              width: "100%",
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        ) : (
                          <Carousel autoplay style={{ borderRadius: 4 }}>
                            {images.map((url, idx) => (
                              <div key={idx}>
                                <Image
                                  src={url}
                                  alt={`Blog image ${idx + 1}`}
                                  fallback="https://via.placeholder.com/250x150?text=No+Image"
                                  preview={false}
                                  style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: 4,
                                  }}
                                />
                              </div>
                            ))}
                          </Carousel>
                        )}
                      </div>
                    )}

                    {/* Right Column - Content */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <Title level={4}>{item.blogTitle}</Title>
                        <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                          {item.blogContent}
                        </Paragraph>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        <Space>
                          <Avatar icon={<UserOutlined />} />
                          <Text type="secondary">
                            {item.authorName || "Unknown"}
                          </Text>
                        </Space>
                        <Space size="large">
                          <Text type="secondary">
                            <LikeOutlined /> {item.likeCount ?? 0}
                          </Text>
                          <Text type="secondary">
                            <DislikeOutlined /> {item.dislikeCount ?? 0}
                          </Text>
                          <Text type="secondary">🕒 {item.createdAt}</Text>
                        </Space>
                      </div>
                    </div>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      </InfiniteScroll>
    </div>
  );
};

export default BlogFeeds;
