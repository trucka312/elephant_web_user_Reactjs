import { CameraOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { alerts } from "../../../utils/alerts";

const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
export default function Upload({
  images,
  setImages,
  width,
  height = width,
  text,
}) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const uploadedImages = event.target.files;
    if (!allowedImageTypes.includes(uploadedImages[0].type)) {
      alerts.error("Vui lòng chọn ảnh cho hợp lệ");
      return;
    }
    const formData = new FormData();
    formData.append("image", uploadedImages[0]);

    setLoading(true);
    axios
      .post("https://api-dev.hihihi.vn/api/images", formData)
      .then((response) => {
        setImages(response.data.data);
      })
      .catch((error) => {
        alerts.error(error.response?.data?.msg || "Có lỗi, vui lòng thử lại");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteClick = () => {
    setImages("");
  };

  return (
    <div
      className={`cursor-pointer rounded-md flex justify-start items-center`}
      style={{ minHeight: height }}
    >
      <Spin spinning={loading}>
        <div className="flex gap-4 flex-wrap">
          <div
            onClick={handleImageClick}
            className={`relative w-[${width}] h-[${height}] text-[#21409A] bg-slate-200 flex flex-col justify-center items-center rounded-md gap-1`}
            style={{ height: height, width: width }}
          >
            {images ? (
              <div
                className="relative group"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images}
                  alt=""
                  style={{ height: height, width: width }}
                  className={`w-[${width}] object-cover rounded-md`}
                />
                <div
                  style={{ height: height, width: width }}
                  className={`absolute hidden w-[${width}] bg-[#0000004D] group-hover:flex duration-500 transition top-0 rounded-md  justify-center items-center gap-3`}
                >
                  <Tooltip title="Sửa" color={"blue"}>
                    <EditOutlined
                    onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick();
                      }}
                      className="text-white text-[20px] hover:text-blue-600 font-bold"
                    />
                  </Tooltip>
                  <Tooltip title="Xóa" color={"red"} >
                    <DeleteOutlined
                      className="text-white text-[20px] hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick();
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            ) : (
              <span>
                <div className="flex flex-col items-center"><CameraOutlined /> {text}</div>
              </span>
            )}
          </div>

          <input
            type="file"
            ref={inputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
            multiple
          />
        </div>
      </Spin>
    </div>
  );
}

Upload.propTypes = {
  images: PropTypes.string,
  setImages: PropTypes.func,
  height: PropTypes.string,
  width: PropTypes.string,
  text: PropTypes.string,
};
