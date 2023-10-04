import { Button, Col, Form, Input, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import LOGO from '../../assets/images/logo.svg';
import { useAuthStore } from '../../store/authStore';
import { alerts } from '../../utils/alerts';
import { useState } from 'react';

const Login = () => {
  const navigate = useNavigate(); 
 
  const [phoneNumber, setPhoneNumber] = useState('');
  const { sendOtp, loading } = useAuthStore((state) => state);

  const onSubmit = (value) => {
    const onSuccess = () => {
      navigate('/confirm_otp', { state: { phoneNumber } });
    };
    const onFail = (error) => {
      alerts.error(error?.response?.data?.msg);
    };
    sendOtp(value, onSuccess, onFail);
  };

  // validate number phone
  const validatePhoneNumber = ( rule, value, callback) => {
    if (!value) {
      callback('Vui lòng nhập số điện thoại!');
    } else if (!/^0\d{9,10}$/.test(value)) {
      callback('Số điện thoại không hợp lệ!');
    } else {
      callback();
    }
  };

  return (
    <Row className="w-[900px] mx-auto  p-5 rounded-[6px] mt-[25vh] flex shadow-2xl">
      <Col span={7} className="w-[280px] h-auto mx-auto">
        <img src={LOGO} className='w-full h-full' alt="logo" />
      </Col>
      <Col span={12} className='mr-[30px]'>
        <Form
          className='w-[430px]'
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 20,
          }}
          onFinish={onSubmit}
          autoComplete="off"
        >
          <div className="flex items-center justify-center mt-5">
            <h1 className='font-medium text-center'>HIHIHI</h1>
          </div>
          <p className="font-medium text-center text-[15px] mb-8 mt-5">Xin chào, vui lòng nhập số điện thoại</p>
          <Form.Item
            label="Số điện thoại"
            name="phone_number"
            labelAlign="left"
            rules={[
              {
                validator: validatePhoneNumber,
              },
            ]}
            sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 4}}
          >
            <Input style={{height: 40}} placeholder="Số điện thoại" type="tel" onChange={(e) => {setPhoneNumber(e.target.value)}}/>
          </Form.Item>

          <div className="text-end mt-[20px] mb-[15px] flex justify-end">
            <Link to='/login_by_pass'>Đăng nhập bằng mật khẩu</Link>
          </div>

          <Button className="mt-4 mb-5 h-[40px]" block type="primary" htmlType="submit" loading={loading}>
            Tiếp theo
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
