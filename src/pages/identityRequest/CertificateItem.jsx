import { Col, Row } from "antd";
import UploadMultiple from "../../components/common/upload/UploadMutiple";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function CertificateItem({
  certificate,
  index,
  setCertificateData,
  certificateData,
  disabled
}) {
  const [images, setImages] = useState(
    certificate?.images ? [...certificate.images] : []
  );

  const handleSetCertificateData = () => {
    const newCertificate = [...certificateData];
    newCertificate[index] = { name: certificate.name, images: [...images] };
    setCertificateData(newCertificate);
  };

  useEffect(() => {
    handleSetCertificateData();
  }, [images]);

  return (
    <Row className="mt-2" gutter={[26, 15]}>
      <Col span={12}>
        <Row>
          <Col span={8}>{index + 1}</Col>
          <Col span={12} className="text-[#0e2482] font-semibold">
            {certificate.name}
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <UploadMultiple
          images={images}
          setImages={setImages}
          width="70px"
          height="70px"
          text="Thêm"
          disabled={disabled}
        />
      </Col>
    </Row>
  );
}

CertificateItem.propTypes = {
  certificate: PropTypes.object,
  index: PropTypes.number,
  setCertificateData: PropTypes.func,
  certificateData: PropTypes.array,
  disabled: PropTypes.bool
};
