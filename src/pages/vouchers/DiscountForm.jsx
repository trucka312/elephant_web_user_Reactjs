import { Button, Col, DatePicker, Form, Image, Input, Modal, Row, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ContentHeader from '../../components/content-header';
import Loading from '../../components/loading/Index';
import { getPathByIndex } from '../../utils';
import { alerts } from '../../utils/alerts';
import { PlusOutlined } from '@ant-design/icons';
import ProductModal from './component/ProductModal.jsx';
import { formatPriceProduct } from '../../utils/product.jsx';
import { useDiscountsStore } from '../../store/discountsStore.js';

export default function DiscountForm() {
  const { createDiscount, loading, updateDiscount } = useDiscountsStore((state) => state);
  const voucherId = getPathByIndex(2);
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // disable time
  const disabledDate = (current) => {
    // Calculate the time difference between the selected date and current time
    const timeDifference = dayjs().startOf('day').diff(current.startOf('day'), 'days');
  
    // Disable if the time difference is greater than or equal to 1
    return timeDifference >= 1;
  };

  // handle edit discount
  if (voucherId !== 'create') {
    useEffect(() => {
      if (location?.state?.products) {
        setSelectedProducts(location.state.products);
      }
    }, []);
  }

  // get list product from product modal
  const handleProductSelection = (selectedProducts) => {
    setSelectedProducts(selectedProducts);
    setIsModalVisible(false);
  };

  // handle delete product on list products field
  const handleDeleteProduct = (productToDelete) => {
    const remainingProducts = selectedProducts.filter((product) => product.id !== productToDelete.id);
    setSelectedProducts(remainingProducts);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onSubmit = (value) => {
    const onSuccess = () => {
      alerts.success(voucherId === 'create' ? 'Tạo thành công' : 'Cập nhật thành công');
      navigate(-1);
    };
    const onFail = (error) => {
      alerts.error(error);
    };
    // Extract selected product IDs from selectedProducts and join them with commas
    const selectedProductIds = selectedProducts.map((product) => product.id).join(',');
    // Add the selected product IDs as a comma-separated string to the value object
    value.product_ids = selectedProductIds;
    if (voucherId === 'create')
      createDiscount({ ...value, set_limit_amount: value.remain ? true : false }, onSuccess, onFail);
    else updateDiscount(voucherId, { ...value, set_limit_amount: value.remain ? true : false }, onSuccess, onFail);
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
        <ContentHeader title={voucherId === 'create' ? 'Tạo giảm giá sản phẩm' : 'Cập nhật giảm giá sản phẩm'} />
        <Row className="p-10 pt-5 justify-between min-h-[465px]">
          <Col span={24}>
            {/* name */}
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
              initialValue={location?.state?.name}
            >
              <Input placeholder="Nhập tên chương trình" defaultValue={location?.state?.name} />
            </Form.Item>

            {/* date picker area */}
            <Row>
              {/* start date */}
              <Col span={11}>
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
                    className="w-full"
                    disabledDate={disabledDate}
                    placeholder="Từ ngày"
                    showTime={{
                      defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                    }}
                    defaultValue={
                      location?.state?.start_time ? dayjs(location?.state?.start_time, 'DD/MM/YYYY HH:mm:ss') : ''
                    }
                  />
                </Form.Item>
              </Col>

              {/* end date */}
              <Col span={11} className="ml-[15px]">
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
                    className="w-full"
                    format="DD-MM-YYYY HH:mm:ss"
                    disabledDate={disabledDate}
                    placeholder="Đến ngày"
                    showTime={{
                      defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                    }}
                    defaultValue={location?.state?.end_time ? dayjs(location?.state?.end_time) : ''}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* discount % and amount area */}
            <Row>
              <Col span={11}>
                <Form.Item
                  label="Giảm giá (%)"
                  labelCol={{
                    span: 24,
                  }}
                  name="value"
                  labelAlign="left"
                  className="font-medium"
                  sx={{ width: '100%' }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập (%) giảm giá sản phẩm',
                    },
                    {
                  validator(_, value) {
                    
                      if (value <= 99) {
                        // Cho phép giá trị từ 0 đến 99
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Giá trị phải từ 0 đến 99!'));
                    
                  },
                },
                  ]}
                  initialValue={location?.state?.value}
                >
                  <Input type="number" placeholder="Nhập giảm giá" defaultValue={location?.state?.value} />
                </Form.Item>
              </Col>
            </Row>

            {/* products picker area  */}
            <Form.Item
              label="* Sản phẩm được áp dụng"
              name="product_ids"
              labelAlign="left"
              className="font-medium"
              sx={{ width: '100%' }}
              rules={[
                {
                  validator() {
                    if (selectedProducts && selectedProducts.length) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Vui lòng chọn sản phẩm'));
                  },
                },
              ]}
              initialValue={location?.state?.code}
            >
              <Button type="primary" ghost icon={<PlusOutlined />} onClick={showModal}>
                Thêm sản phẩm
              </Button>

              {/* modal products */}
              <Modal
                width={800}
                height={600}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
              >
                <ProductModal onConfirm={handleProductSelection} />
              </Modal>

              <Row className="mt-[15px]">
                <Col span={24}>
                  <Table
                    dataSource={selectedProducts}
                    pagination={false}
                    rowKey={(item) => item.id}
                    columns={[
                      {
                        title: 'ID',
                        dataIndex: 'id',
                        key: 'id',
                      },
                      {
                        title: 'Tên',
                        dataIndex: 'name',
                        key: 'name',
                        render: (name) => <p className="text-[#0e2482] font-medium">{name}</p>,
                      },
                      {
                        title: 'Mã SKU',
                        dataIndex: 'sku',
                        key: 'sku',
                      },
                      {
                        title: 'Hình ảnh',
                        dataIndex: 'images',
                        key: 'images',
                        align: 'center',
                        render: (images) => (
                          <Image
                            src={images && images.length && images[0].image_url}
                            width={50}
                            height={50}
                            className="object-cover rounded-md"
                          />
                        ),
                      },
                      {
                        title: 'Giá',
                        dataIndex: 'price',
                        key: 'price',
                        render: (_, product) => formatPriceProduct(product),
                      },
                      {
                        title: 'Hành động',
                        key: 'action',
                        render: (item) => (
                          <Button type="link" danger onClick={() => handleDeleteProduct(item)}>
                            Xóa
                          </Button>
                        ),
                      },
                    ]}
                  />
                </Col>
              </Row>
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
