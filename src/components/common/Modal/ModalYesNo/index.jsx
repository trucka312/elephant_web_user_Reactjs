import { Modal } from 'antd';

const index = ({ title , text, handleConfirm, handleCancel,handleVisible,  btnOkText = "Xác nhận", btnCancelText = "Hủy", ...props}) => {
  
  return (
    <Modal
      title={title}
      onOk={handleConfirm}
      onCancel={handleCancel}
      visible={handleVisible}
      okText={btnOkText}
      cancelText={btnCancelText}
      {...props}
    >
      <p>{text}</p>
    </Modal>
  );
};

export default index;
