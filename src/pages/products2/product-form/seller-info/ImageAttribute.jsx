import { useEffect, useState } from "react";
import Upload from "../../../../components/common/upload";
import PropTypes from "prop-types";

export default function ImageAttribute({defaultImage, handleChangeImage, index }) {
  const [images, setImages] = useState(defaultImage);

  useEffect(() => {
    if(images) handleChangeImage(images, index);
  }, [images]);

  return (
    <div>
      <Upload
        name="image_url"
        images={images}
        setImages={setImages}
        text="Thêm"
        width="60px"
        height="60px"
      />
    </div>
  );
}

ImageAttribute.propTypes = {
  defaultImage: PropTypes.string,
  index: PropTypes.number,
  handleChangeImage: PropTypes.func,
};
