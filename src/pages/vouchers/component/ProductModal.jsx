import { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'antd';
import { Image } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

import { useProductsStore } from '../../../store/productsStore';
import { getPathByIndex } from '../../../utils';
import { formatPriceProduct } from '../../../utils/product';
import '../../products2/product.css';
import SearchInput from '../../../components/common/search-input/index.jsx';

function ProductModal(props) {
  const navigate = useNavigate();
  const statusProductByPath = getPathByIndex(3);
  const { products, getAllProducts, loading } = useProductsStore((state) => state);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // initial table param
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
    status: statusProductByPath || '',
    keyword: '',
  });
  
  // initial filed key for every item
  const dataTable = [];
  for (let i = 0; i < products?.length; i++) {
      dataTable.push({
        key: i,
        ...products[i],
      });
    }

  // initial table column data main
  const productsTable = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      sorter: (product1, product2) => +product1.id - +product2.id,
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
      title: 'Mã SKU',
      dataIndex: 'sku',
      key: 'sku',
      sorter: (product1, product2) => (product1.sku || '').localeCompare(product2.sku || ''),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (product1, product2) => (product1.name || '').localeCompare(product2.name || ''),
      render: (name, product) => (
        <p className="text-[#0e2482] font-medium cursor-pointer">
          <Link to={`/products/edit/${product.id}`}>{name}</Link>
        </p>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (product1, product2) => product1.price.toString().localeCompare(product2.price.toString()),
      render: (_, product) => formatPriceProduct(product),
    },
    {
      title: 'Đã áp dụng giảm giá',
      dataIndex: 'has_in_discount',
      key: 'has_in_discount',
      sorter: (product1, product2) => product1.has_in_discount.toString().localeCompare(product2.has_in_discount.toString()),
      render: (_, product, index) => <p key={index}>{product?.has_in_discount ? 'Đã áp dụng' : 'Chưa áp dụng'}</p>,
    },
  ];
  
  // handle table param
  const handleTableChange = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: pagination.current,
        status: statusProductByPath || '',
      },
    });
  };

  useEffect(() => {
    fetchDataTable(tableParams.keyword);

    window.addEventListener('beforeunload', () => {});
    return () => {
      window.removeEventListener('beforeunload', () => {});
    };
  }, [navigate, tableParams.status, tableParams.pagination.current]);

  // get data intern API
  const fetchDataTable = (keyword) => {
    const onSuccess = (response) => {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.total,
        },
      });
    };
    const onFail = (err) => {
      alert.error(err);
    };
    getAllProducts(
      keyword,
      statusProductByPath || tableParams.status,
      tableParams.pagination.current || 1,
      onSuccess,
      onFail,
    );
  };

  // handle search change
  const onKeywordChange = (value) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      keyword: value,
    });
  };

  // handle selected item on table
  const handleConfirmSelection = () => {
    if (selectedRowKeys.length > 0) {
      const selectedProductList = dataTable?.filter(product => selectedRowKeys.includes(product.key));// get all info item has slected
      props.onConfirm(selectedProductList); // throw to parents cpn
    }
  };

  return (
    <div>
      {/* header */}
      <div className="">
        <h1 className="font-medium">Chọn sản phẩm</h1>
        <p style={{color: '#d55252'}}>Lưu ý !!! Những sản phẩm đang nằm trong chương trình giảm giá khác thì không thể áp dụng thêm nếu chưa hết hạn</p>
      </div>
      {/* body */}
      <div className="py-[10px]">
        {/* search area */}
        <Row className="">
          <Col span={12}>
            <SearchInput
              placeholder='Nhập tên sản phẩm để tìm kiếm...'
              keyword={tableParams.keyword}
              onChange={onKeywordChange}
              onSearch={fetchDataTable}
              enterButton
            />
          </Col>
        </Row>
        {/* table product area */}
        <div className="mt-[10px]">
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedKeys) => {
                setSelectedRowKeys(selectedKeys);
              },
            }}
            columns={productsTable}
            scroll={{ x: true }}
            size="middle"
            bordered
            dataSource={!_.isEmpty(dataTable) ? dataTable : []}
            loading={loading}
            onChange={handleTableChange}
            pagination={tableParams.pagination}
          />
        </div>

        <div className="mt-10 flex justify-end">
          <Button type="primary" onClick={handleConfirmSelection}>Xác nhận</Button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;

ProductModal.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
};
