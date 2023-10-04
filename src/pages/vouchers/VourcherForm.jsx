import { Button, Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select, Switch } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ContentHeader from '../../components/content-header';
import Loading from '../../components/loading/Index';
import { useVouchersStore } from '../../store/vouchersStore.js';
import { getPathByIndex } from '../../utils';
import { alerts } from '../../utils/alerts';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export default function VoucherForm() {
  const voucherId = getPathByIndex(2);
  const navigate = useNavigate();
  const location = useLocation();
  const { createVoucher, loading, updateVoucher } = useVouchersStore((state) => state);

  const [isShowVoucher, setIsShowVoucher] = useState(voucherId === 'create' ? true : location?.state ? location?.state?.is_show_vouvher : true);
  // const [limitDiscount, setLimitDiscount] = useState()
  const [discountType, setDiscountType] = useState(location?.state?.discount_type || 0);
  const [limitTotal, setLimitTotal] = useState(location?.state ? location?.state?.set_limit_total : true);
  const [limitDiscount, setLimitDiscount] = useState(
    location?.state ? location?.state?.set_limit_value_discount : true,
  );
  

  const onSubmit = (value) => {
    const onSuccess = () => {
      alerts.success(voucherId === 'create' ? 'Tạo thành công' : 'Cập nhật thành công');
      navigate(-1);
    };
    const onFail = (error) => {
      alerts.error(error);
    };
    if (voucherId === 'create')
      createVoucher({ ...value, set_limit_amount: value.remain ? true : false }, onSuccess, onFail);
    else updateVoucher(voucherId, { ...value, set_limit_amount: value.remain ? true : false }, onSuccess, onFail);
  };

  // handle switch
  const handleIsShowVoucherChange = useCallback((value) => {
    setIsShowVoucher(value);
  }, [setIsShowVoucher]);

  // disable time
  const disabledDate = (current) => {
    // Calculate the time difference between the selected date and current time
    const timeDifference = dayjs().startOf('day').diff(current.startOf('day'), 'days');

    // Disable if the time difference is greater than or equal to 1
    return timeDifference >= 1;
  };

  return (
    <div className="relative">
      <div className="absolute top-[50%] left-[47%]">{loading ? <Loading /> : null}</div>
      <Form
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <ContentHeader title={voucherId === 'create' ? 'Tạo vouchers' : 'Cập nhật vouchers'} />
        <Row className="p-10 pt-5 justify-between min-h-[465px]">
          <Col span={11}>
            <Form.Item
              label="Tên chương trình"
              name="name"
              labelAlign="left"
              className="font-medium"
              sx={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên chương trình!',
                },
              ]}
              initialValue={location?.state?.code}
            >
              <Input placeholder="Nhập tên chương trình" defaultValue={location?.state?.name} />
            </Form.Item>

            <Form.Item
              label="Mã giảm giá"
              name="code"
              labelAlign="left"
              className="font-medium"
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mã giảm giá!',
                },
              ]}
              initialValue={location?.state?.code}
            >
              <Input placeholder="Nhập mã giảm giá" defaultValue={location?.state?.code} />
            </Form.Item>

            <Row className="justify-between">
              <Form.Item
                label="Thời gian bắt đầu"
                name="start_time"
                labelAlign="left"
                className="font-medium"
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn ngày bắt đầu!',
                  },
                ]}
                initialValue={location?.state?.start_time ? dayjs(location?.state?.start_time) : ''}
              >
                <DatePicker
                  format="DD-MM-YYYY HH:mm:ss"
                  placeholder="Từ ngày"
                  disabledDate={disabledDate}
                  defaultValue={
                    location?.state?.start_time ? dayjs(location?.state?.start_time, 'DD/M M/YYYY HH:mm:ss') : ''
                  }
                  showTime={{
                    defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Thời gian kết thúc"
                name="end_time"
                labelAlign="left"
                className="font-medium"
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn ngày kết thúc!',
                  },
                ]}
                initialValue={location?.state?.end_time ? dayjs(location?.state?.end_time) : ''}
              >
                <DatePicker
                  format="DD-MM-YYYY HH:mm:ss"
                  disabledDate={disabledDate}
                  placeholder="Đến ngày"
                  showTime={{
                    defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                  }}
                  defaultValue={location?.state?.end_time ? dayjs(location?.state?.end_time) : ''}
                />
              </Form.Item>
            </Row>

            <Form.Item
              label="Đơn tối thiểu"
              name="set_limit_total"
              className="font-medium mb-[11px]"
              labelAlign="left"
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá trị tối thiểu!',
                },
              ]}
              initialValue={limitTotal}
            >
              <Radio.Group
                options={[
                  { label: 'Có', value: true },
                  { label: 'Không', value: false },
                ]}
                defaultValue={limitTotal}
                className="font-normal"
                onChange={(e) => setLimitTotal(e.target.value)}
                buttonStyle="solid"
              />
            </Form.Item>
            {limitTotal ? (
              <Form.Item
                label=""
                name="value_limit_total"
                className="font-medium"
                labelAlign="left"
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập giá trị tối thiểu!',
                  },
                ]}
                initialValue={location?.state?.value_limit_total}
              >
                <InputNumber
                  placeholder="Nhập giá trị tối thiểu của đơn hàng"
                  style={{ width: '100%' }}
                  defaultValue={location?.state?.value_limit_total}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            ) : null}
          </Col>
          <Col span={12}>
            <Form.Item
              label="Loại giảm giá"
              name="discount_type"
              labelAlign="left"
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn loại giảm giá!',
                },
              ]}
              className="mb-3 font-medium"
              initialValue={discountType}
            >
              <Select
                placeholder="Giảm giá cố định"
                defaultValue={location?.state?.discount_type || 0}
                onChange={(value) => setDiscountType(value)}
              >
                <Select.Option value={0}>Giảm giá cố định</Select.Option>
                <Select.Option value={1}>Giảm giá theo %</Select.Option>
              </Select>
            </Form.Item>

            {/* input for "giảm giá cố định" */}
            {discountType === 0 && (
              <Form.Item
                label=""
                className="font-medium mb-[66px]"
                name="value_discount"
                labelAlign="left"
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập giá trị giảm!',
                  },
                  {
                    validator(_, value) {
                      if (isNaN(value)) {
                        Promise.reject(new Error('Vui lòng nhập giá trị số'));
                      } else {
                        if (value > 0) {
                          // Cho phép giá trị từ 0
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Giá trị phải lớn hơn 0'));
                      }
                    },
                  },
                ]}
                initialValue={location?.state?.value_discount}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  defaultValue={location?.state?.value_discount}
                  placeholder='Nhập giá trị giảm giá cố định'
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            )}

            {/* input for "giảm giá theo %" */}
            {discountType === 1 && ( // Only render if discountType is 1 (percentage discount)
              <Form.Item
                label=""
                className="font-medium mb-[66px]"
                name="value_discount"
                labelAlign="left"
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập giá trị giảm!',
                  },
                  {
                    validator(_, value) {
                      // Validation logic for percentage discount
                      if (value <= 99) {
                        // Cho phép giá trị từ 0 đến 99
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Giá trị phải từ 0 đến 99!'));
                    },
                  },
                ]}
                initialValue={location?.state?.value_discount}
              >
                <InputNumber
                  type="number"
                  placeholder='Nhập giá trị giảm giá theo %'
                  style={{ width: '100%' }}
                  defaultValue={location?.state?.value_discount}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{2})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            )}

            {discountType ? (
              <>
                <Form.Item
                  label="Giảm tối đa"
                  className="font-medium mb-[11px]"
                  name="set_limit_value_discount"
                  labelAlign="left"
                  labelCol={{
                    span: 24,
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập giá trị giới hạn!',
                    },
                  ]}
                  initialValue={limitDiscount}
                >
                  <Radio.Group
                    options={[
                      { label: 'Chọn mức giảm', value: true },
                      { label: 'Không giới hạn', value: false },
                    ]}
                    defaultValue={limitDiscount}
                    className="font-normal"
                    onChange={(e) => setLimitDiscount(e.target.value)}
                    buttonStyle="solid"
                  />
                </Form.Item>
                {limitDiscount ? (
                  <Form.Item
                    label=""
                    className="font-medium"
                    name="max_value_discount"
                    labelAlign="left"
                    labelCol={{
                      span: 24,
                    }}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập giá trị giới hạn!',
                      },
                    ]}
                    initialValue={location?.state?.max_value_discount}
                  >
                    <InputNumber
                      placeholder="Nhập giá trị muốn giới hạn"
                      style={{ width: '100%' }}
                      defaultValue={location?.state?.max_value_discount}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                ) : null}
              </>
            ) : null}

            <Form.Item
              label="Hiển thị cho khách hàng chọn"
              name="is_show_voucher"
              labelAlign="left"
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn loại giảm giá!',
                },
              ]}
              className="mb-3 font-medium"
              initialValue={location?.state?.is_show_voucher || true}
            >
              <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={isShowVoucher} onChange={handleIsShowVoucherChange}/>
            </Form.Item>

          </Col>
        </Row>
        <div className="w-[300px] ml-auto pr-10">
          <Button className="mt-4" block type="primary" htmlType="submit" disabled={loading} width={200}>
            {voucherId === 'create' ? 'Tạo' : 'Cập nhật'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
