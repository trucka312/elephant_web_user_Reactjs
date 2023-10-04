import { CameraOutlined, DeleteOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { alerts } from "../../../utils/alerts";

const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
export default function UploadMultiple({
  images,
  setImages,
  width,
  height = width,
  text,
  disabled,
}) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleImageClick = () => {
    if(disabled) return;
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const selectedImages = [];
    const uploadedImages = event.target.files;

    if (uploadedImages.length) {
      for (let i = 0; i < uploadedImages.length; i++) {
        const file = uploadedImages[i];

        if (!allowedImageTypes.includes(file.type)) {
          alerts.error(`Vui lòng chọn ảnh cho hợp lệ (ảnh ${i + 1})`);
          continue;
        }

        selectedImages.push(file);
      }
    }
    const uploadNextImage = (index) => {
      if (index >= selectedImages.length) {
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedImages[index]);

      setLoading(true);
      axios
        .post("https://api-dev.hihihi.vn/api/images", formData)
        .then((response) => {
          setImages((prevImages) => [...prevImages, response.data.data]);
          uploadNextImage(index + 1);
        })
        .catch((error) => {
          alerts.error(error.response?.data?.msg || "Có lỗi, vui lòng thử lại");
          setLoading(false);
        });
    };

    if (selectedImages.length > 0) {
      uploadNextImage(0);
    }
  };

  const handleDeleteClick = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  return (
    <div
      className={`${ !disabled ? 'cursor-pointer' : 'cursor-not-allowed'} rounded-md flex justify-start items-center`}
      style={{ minHeight: height }}
    >
      <Spin spinning={loading}>
        <div className="flex gap-4 flex-wrap">
          <p
            onClick={handleImageClick}
            className={`w-[${width}] h-[${height}] text-[#21409A] bg-slate-200 flex flex-col justify-center items-center rounded-md gap-1`}
            style={{ height: height, width: width }}
          >
            <CameraOutlined /> <span className=" text-[13px]">{text}</span>
          </p>
          {images &&
            images.length > 0 &&
            images.map((image, index) => (
              <div
                className="relative group"
                key={index}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={image}
                  alt=""
                  style={{ height: height, width: width }}
                  className={`w-[${width}] object-cover rounded-md`}
                />
                {!disabled ? <div
                  style={{ height: height, width: width }}
                  className={`absolute hidden w-[${width}] bg-[#0000004D] group-hover:flex duration-500 transition top-0 rounded-md  justify-center items-center gap-2`}
                >
                  {/* <Tooltip title="Sửa" color={"blue"}>
                    <EditOutlined
                      className="text-white text-[20px] hover:text-blue-600 font-bold"
                    />
                  </Tooltip> */}
                  <Tooltip title="Xóa" color={"red"}>
                    <DeleteOutlined
                      className="text-white text-[20px] hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(index);
                      }}
                    />
                  </Tooltip>
                </div> : null}
              </div>
            ))}

          <input
            type="file"
            ref={inputRef}
            onChange={handleImageChange}
            disabled={disabled}
            style={{ display: "none" }}
            multiple
          />
        </div>
      </Spin>
    </div>
  );
}

UploadMultiple.propTypes = {
  images: PropTypes.array,
  setImages: PropTypes.func,
  height: PropTypes.string,
  width: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
};
