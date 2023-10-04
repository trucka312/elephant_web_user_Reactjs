import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ContentHeader from '../../../components/content-header/index.jsx';
import { useFinanceStore } from '../../../store/financeStore.js';
import { alerts } from '../../../utils/alerts.js';
import { Option } from 'antd/es/mentions/index.js';

const AddBankAccount = () => {
  const navigate = useNavigate();
  const { listBankExits, getAllBankExsits, AddBAnkAccount } = useFinanceStore((state) => state);
  const [isDefault, setIsDefault] = useState(false);

  const onFinish = (values) => {
    AddBAnkAccount(values, () => {
      alerts.success('Thêm tài khoản ngân hàng mới thành công !');
    }, (error) => {
      alerts.error(error);
    })
  };

  useEffect(() => {
    getAllBankExsits(
      () => {},
      (err) => {
        alerts.error(err.msg);
      },
    );
  }, [navigate]);

  const validateField = (rule, value, callback) => {
    if (!value) {
      callback('Vui lòng điền thông tin!');
    } else {
      callback();
    }
  };

  return (
    <Row className="bg-white">
      <Col span={24} className="ml-[-30px]">
        <ContentHeader title="Thêm tài khoản ngân hàng" />
      </Col>

      <Col span={24} className="mt-6">
        <Form name="basic" onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          <Form.Item label="Tên ngân hàng" name="bank_name" rules={[{ validator: validateField }]}>
            <Select
              className="w-full mb-2"
              placeholder="Chọn tên ngân hàng"
            >
              {listBankExits.map((bank) => (
                <Option key={bank.id} value={bank?.name}>
                  <div className="flex items-center">
                    <img src={bank?.logo} alt="logo" className="w-[64px] h-auto" />
                    <p className="truncate">{bank.name}</p>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Tên chủ tài khoản" name="bank_account_name" rules={[{ validator: validateField }]}>
            <Input placeholder="Nhập tên chủ tài khoản" />
          </Form.Item>
          <Form.Item label="Số tài khoản" name="bank_account_number" rules={[{ validator: validateField }]}>
            <Input placeholder="Nhập số tài khoản" />
          </Form.Item>

          <Form.Item label="Chi nhánh" name="bank_name_branch" rules={[{ validator: validateField }]}>
            <Input placeholder="Nhập chi nhánh" />
          </Form.Item>
          <Form.Item label="Đặt làm mặc định" name="is_default" initialValue={isDefault}>
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} value={isDefault} onChange={() => setIsDefault(!isDefault)}/>
          </Form.Item>
          <div className="w-full text-center">
            {' '}
            <Button type="primary" className="bg-[#21409a] w-[20%]" htmlType="submit">
              Lưu thông tin
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default AddBankAccount;
