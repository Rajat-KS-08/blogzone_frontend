import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  Avatar,
  Button,
  Upload,
  Input,
  DatePicker,
  Select,
  Typography,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import type { FormData } from "../../models/profileModels";
import {
  countries,
  allowedProfileNameChars,
  calculateAgeString,
  getBase64,
} from "../../helpers/profilePageHelpers";
import "./myProfile.scss";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/rootReducer";
import type { IUser } from "../../models/authModel";
import { updateUserData } from "../../apiServices/authService";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/slices/authReducer";
import { useToastApi } from "../../custom_hooks/ToastProvider";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface ProfileFormProps {
  setRenderedContent: (content: string | null) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ setRenderedContent }) => {
  const userData: IUser | null | string = useSelector(
    (state: RootState) => state?.auth?.user || ""
  );
  const dispatch = useDispatch();
  // States
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [base64URL, setBase64URL] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      userName: "",
      profileName: "",
      bio: "",
      age: "",
      countryName: "",
      gender: "",
    },
  });

  const toast = useToastApi();

  const selectedDob = watch("age");

  // Handle File Upload
  const handleAvatarUpload = async (info: any) => {
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
      //console.log("Base64 string:", base64String);
      setBase64URL(base64String);
    }
  };

  const validateUserName = (value: string) => {
    if (!value) return "User name is required";
    if (value.length > 40) return "Max 40 characters are allowed";
    if (!/^[A-Za-z ]+$/.test(value)) return "No special character is allowed";
    if (value.startsWith(" ")) return "User name cannot start with a space";
    return true;
  };

  const validateProfileName = (value: string) => {
    if (!value) return "Profile Name is required";
    if (value.length > 16) return "Max 16 characters are allowed";
    if (!allowedProfileNameChars.test(value))
      return "Only ! @ . _ - special characters allowed";
    return true;
  };

  const ageString = calculateAgeString(selectedDob);

  useEffect(() => {
    if (
      typeof userData === "object" &&
      userData !== null &&
      "user_id" in userData
    ) {
      reset({
        userName: userData.user_name || "",
        profileName: userData.profile_name || "",
        bio: userData.bio || "",
        age: userData?.dob ? moment(userData.dob) : "",
        countryName: userData?.country || "",
        gender: userData?.gender || "",
      });
      if (userData?.profile_img) {
        setAvatarUrl(userData.profile_img); // base64 string from API
        setBase64URL(userData.profile_img); // optional if you need it for update
      }
    }
  }, [userData, reset]);

  const handleFinish = async (data: FormData) => {
    const payload: any = {
      user_id: (userData as IUser).user_id,
      user_name: data.userName,
      profile_name: data.profileName,
      bio: data.bio,
      country: data.countryName,
      gender: data?.gender,
      dob: data?.age ? data?.age?.toISOString() : "",
      profile_img: base64URL || "",
    };
    const updatedUser = await updateUserData(payload);

    if (updatedUser) {
      toast.success({ content: "Profile updated successfully!", duration: 5 });
      dispatch(setUserData(updatedUser));
    } else {
      toast.error({
        content: "Failed to update profile. Please try again.",
        duration: 5,
      });
    }
    setRenderedContent(null);
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit((data) => handleFinish(data))}
      className="user-profile-form"
    >
      <Row className="profile-form-row" gutter={24}>
        {/* Column 1 unchanged */}
        <Col xs={24} sm={10} className="profile-form-first-col">
          {/* Avatar, User Name, Profile Name fields as before (unchanged) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              size={80}
              shape="circle"
              src={avatarUrl}
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Upload
              showUploadList={false}
              beforeUpload={() => false} // prevent auto upload
              onChange={handleAvatarUpload}
              accept="image/*"
            >
              <Button className="upload-btn" icon={<UploadOutlined />}>
                Update profile pic
              </Button>
            </Upload>
          </div>

          <Form.Item
            label="User Name"
            required
            validateStatus={
              errors.userName ? "error" : watch("userName") ? "success" : ""
            }
            help={
              typeof errors.userName?.message === "string"
                ? errors.userName.message
                : undefined
            }
            style={{ marginTop: 24 }}
          >
            <Controller
              name="userName"
              control={control}
              rules={{ validate: validateUserName }}
              render={({ field }) => (
                <Input
                  {...field}
                  maxLength={40}
                  suffix={
                    errors.userName ? (
                      <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                    ) : watch("userName") ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : null
                  }
                  status={errors.userName ? "error" : undefined}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Profile Name"
            required
            validateStatus={
              errors.profileName
                ? "error"
                : watch("profileName")
                ? "success"
                : ""
            }
            help={
              typeof errors.profileName?.message === "string"
                ? errors.profileName.message
                : undefined
            }
          >
            <Controller
              name="profileName"
              control={control}
              rules={{ validate: validateProfileName }}
              render={({ field }) => (
                <Input
                  {...field}
                  maxLength={16}
                  suffix={
                    errors.profileName ? (
                      <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                    ) : watch("profileName") ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : null
                  }
                  status={errors.profileName ? "error" : undefined}
                />
              )}
            />
          </Form.Item>
        </Col>

        {/* Column 2 updated */}
        <Col xs={24} sm={14} className="profile-form-second-col">
          {/* Bio */}
          <Form.Item
            label="Bio"
            help={
              typeof errors.bio?.message === "string"
                ? errors.bio.message
                : undefined
            }
          >
            <Controller
              name="bio"
              control={control}
              rules={{
                maxLength: {
                  value: 80,
                  message: "Max 80 characters are allowed",
                },
              }}
              render={({ field }) => (
                <TextArea
                  {...field}
                  maxLength={80}
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  style={{ resize: "none" }}
                />
              )}
            />
          </Form.Item>

          {/* Date of Birth with inline age */}
          <Form.Item
            label="Date of Birth"
            required
            validateStatus={errors.age ? "error" : selectedDob ? "success" : ""}
            help={
              typeof errors.age?.message === "string"
                ? errors.age.message
                : undefined
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Controller
                name="age"
                control={control}
                rules={{ required: "Date of Birth is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    style={{ width: "50%" }}
                    placeholder="Select date"
                    format="YYYY-MM-DD"
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                    disabledDate={(current) =>
                      current ? current > moment().endOf("day") : false
                    }
                  />
                )}
              />
              {ageString && (
                <Text
                  style={{
                    color: "green",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {ageString}
                </Text>
              )}
            </div>
          </Form.Item>

          {/* Country and Gender in same row */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Country"
                required
                validateStatus={
                  errors.countryName
                    ? "error"
                    : watch("countryName")
                    ? "success"
                    : ""
                }
                help={
                  typeof errors.countryName?.message === "string"
                    ? errors.countryName.message
                    : undefined
                }
              >
                <Controller
                  name="countryName"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Select country"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      allowClear={false}
                    >
                      {countries.map((country) => (
                        <Option key={country} value={country}>
                          {country}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Gender"
                required
                validateStatus={
                  errors.gender ? "error" : watch("gender") ? "success" : ""
                }
                help={
                  typeof errors.gender?.message === "string"
                    ? errors.gender.message
                    : undefined
                }
              >
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <Select {...field} placeholder="Select gender" allowClear>
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      <Form.Item className="profile-form-submit-btn">
        <Button
          className="submit-btn"
          type="primary"
          htmlType="submit"
          disabled={!isValid}
        >
          Submit
        </Button>
        <Button className="cancel-btn" onClick={() => setRenderedContent(null)}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm;
