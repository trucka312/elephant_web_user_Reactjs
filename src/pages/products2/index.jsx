import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Image, Layout, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/images/image-default.jpg';
import SearchInput from '../../components/common/search-input';
import { statusProduct } from '../../constants';
import { useProductsStore } from '../../store/productsStore';
import { formatNumber, getPathByIndex } from '../../utils';
import { alerts } from '../../utils/alerts';
import { formatPriceProduct } from '../../utils/product';
import './product.css';
export default function Products() {
  const navigate = useNavigate();
  const statusProductByPath = getPathByIndex(3);
  const {
    products,
    getAllProducts,
    loading,
    infoTable,
    deleteProduct,
    resetInitValue,
  } = useProductsStore((state) => state);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
    status: statusProductByPath || "",
    keyword: "",
  });

  const handleTableChange = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: pagination.current,
        status: statusProductByPath || "",
      },
    });
  };

  const productsTable = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      sorter: (product1, product2) => +product1.id - +product2.id,
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      align: "center",
      render: (images) => (
        <Image
          src={images && images.length ? images[0].image_url : defaultImage}
          width={50}
          height={50}
          className="object-cover rounded-md"
        />
      ),
    },
    {
      title: "Mã SKU",
      dataIndex: "sku",
      key: "sku",
      sorter: (product1, product2) =>
        (product1.sku || "").localeCompare(product2.sku || ""),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (product1, product2) =>
        (product1.name || "").localeCompare(product2.name || ""),
      render: (name, product) => (
        <p className="text-[#0e2482] font-medium cursor-pointer">
          <Link to={`/products/edit/${product.id}`}>{name}</Link>
        </p>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (product1, product2) =>
        product1.price.toString().localeCompare(product2.price.toString()),
      render: (_, product) => formatPriceProduct(product),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, product) => {
        switch (product.status) {
          case statusProduct.APPROVED:
            return (
              <div className="border-[#27AE60] border-solid text-[#27AE60] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#27AE601A] text-center">
                Đã duyệt
              </div>
            );
          case statusProduct.VIOLATION:
            return (
              <div className="border-[#E83A2F] border-solid text-[#E83A2F] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#E83A2F1A] text-center">
                Vi phạm
              </div>
            );
          case statusProduct.UNAPPROVED:
            return (
              <div className="border-[#F0AD00] border-solid text-[#F0AD00] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#F0AD001A] text-center">
                Từ chối
              </div>
            );
          case statusProduct.DELETED:
            return (
              <div className="border-[#FF833D] border-solid text-[#FF833D] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#F0AD001A] text-center">
                Vi phạm
              </div>
            );
          default:
            return (
              <div className="border-[#218ECB] border-solid text-[#218ECB] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#218ECB1A] text-center">
                Chờ duyệt
              </div>
            );
        }
      },
    },
    {
      title: "Lượt xem",
      dataIndex: "view",
      key: "view",
      sorter: (product1, product2) =>
        product1.view.toString().localeCompare(product2.view.toString()),
      render: (_, product) => {
        return <div>{formatNumber(product.view)}</div>;
      },
    },
    {
      title: "Lượt thích",
      dataIndex: "likes",
      key: "likes",
      sorter: (product1, product2) =>
        product1.likes.toString().localeCompare(product2.likes.toString()),
      render: (_, product) => {
        return <div>{formatNumber(product.likes)}</div>;
      },
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      align: "center",
      render: (product) => {
        return (
          <Space size="middle">
            <Tooltip title="Sửa" color={"blue"}>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/products/edit/${product.id}`)}
              ></Button>
            </Tooltip>

            <Popconfirm
              placement="left"
              title="Bạn có chắc muốn xóa sản phẩm này?"
              onConfirm={() => handleDeleteProduct(product.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Tooltip title="Xóa" color={"red"}>
                <Button size="small" icon={<DeleteOutlined />} danger></Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const dropdownOption = [
    {
      value: "",
      label: "Tất cả",
    },
    {
      value: "0",
      label: "Chờ duyệt",
    },
    {
      value: "2",
      label: "Đã duyệt",
    },
    {
      value: "3",
      label: "Từ chối",
    },
    {
      value: "1",
      label: "Vi phạm",
    },
    {
      value: "4",
      label: "Đã xóa",
    },
  ];

  useEffect(() => {
    fetchDataTable(tableParams.keyword);

    window.addEventListener("beforeunload", () => {});
    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, [navigate, tableParams.status, tableParams.pagination.current]);

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
      onFail
    );
  };

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

  const onChangDropdown = (e) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      status: e,
    });
  };

  const handleDeleteProduct = (productId) => {
    const onSuccess = () => {
      alerts.success("Xóa sản phẩm thành công");
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    deleteProduct(productId, onSuccess, onFail);
  };

  return (
    <Layout.Content className="px-5 mt-4">
      <div className="flex my-6">
        <div className="flex items-center gap-4">
          {!statusProductByPath && (
            <Select
              style={{ width: 200 }}
              defaultValue=""
              options={dropdownOption}
              onChange={onChangDropdown}
            />
          )}

          <SearchInput
            keyword={tableParams.keyword}
            onChange={onKeywordChange}
            onSearch={() => {}}
          />
          <p className="text-[#0e2482] font-medium">{infoTable.total} sản phẩm</p>
        </div>

        <div className="ml-[40px]">
          <Link to="/products/multi_create">
            <Button type="primary" className="mx-[15px]">
              Thêm hàng loạt
            </Button>
          </Link>
          <Link to="/products/create">
            <Button type="primary" onClick={resetInitValue}>
              Thêm sản phẩm
            </Button>
          </Link>
        </div>
      </div>
      <Table
        rowClassName="editable-row"
        columns={productsTable}
        scroll={{ x: true }}
        size="middle"
        dataSource={products.length ? products : []}
        loading={loading}
        onChange={handleTableChange}
        pagination={tableParams.pagination}
      />
    </Layout.Content>
  );
}

Products.propTypes = {
  products: PropTypes.array,
  loading: PropTypes.bool,
  infoTable: PropTypes.object,
  statusProductByPath: PropTypes.string,
};
