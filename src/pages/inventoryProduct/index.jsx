import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Image,
  Input,
  Modal,
  Select,
  Spin,
  Table,
  Tooltip
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/images/image-default.jpg";
import { useBranchesStore } from "../../store/branchesStore";
import { useProductsStore } from "../../store/productsStore";
import { formatNumber } from "../../utils";
import { alerts } from "../../utils/alerts";
import { formatPriceProduct } from "../../utils/product";

const initUpdateParams = {
  distribute_name: "",
  element_distribute_name: "",
  product_id: "",
  stock: 0,
  sub_element_distribute_name: "",
};

const initTableParams = {
  pagination: {
    current: 1,
    pageSize: 20,
  },
  status: "",
  keyword: "",
}

export default function InventoryProduct() {
  const navigate = useNavigate();
  const { products, getAllProducts, loading  } =
    useProductsStore((state) => state);
  const { updateBalance, loadingUpdate, getAllBranches, branches } = useBranchesStore((state) => state);

  const valueDefaultDropdown =
    branches && branches.length
      ? branches.filter((branch) => branch.is_default_order_online === true)[0]
          .id
      : null;

  const [branchId, setBranchId] = useState(valueDefaultDropdown || null);
  const [tableParams, setTableParams] = useState(initTableParams);
  const [isOpenDrawer, setOpenDrawer] = useState(false);
  const [updateParams, setUpdateParams] = useState(initUpdateParams);

  useEffect(() => {
    if (branches && branches.length) {
      fetchDataTable(tableParams.keyword);
      setBranchId(valueDefaultDropdown);
    }

    window.addEventListener("beforeunload", () => {});
    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, [navigate, tableParams.status, tableParams.pagination.current, branches]);

  useEffect(() => {
    const onSuccess = () => {
      setBranchId(valueDefaultDropdown);
    };
    getAllBranches(onSuccess);
  }, []);

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
      tableParams.status,
      tableParams.pagination.current || 1,
      onSuccess,
      onFail,
      branchId
    );
  };

  const handleTableChange = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: pagination.current,
        status: "",
      },
    });
  };

  const dataProductMain = [];
  for (let i = 0; i < products.length; ++i) {
    dataProductMain.push({
      key: i.toString(),
      ...products[i],
    });
  }

  const dropdownBranchOption =
  branches && branches.length
  ? branches.map((branch) => {
    return {
      value: branch.id,
      label: branch.name,
    };
  })
  : [];
  console.log('dropdownBranchOption: ', dropdownBranchOption);

  const onChangDropdown = (id) => {
    setBranchId(id);
    fetchDataTable(tableParams.keyword);
  };

  const expandedRowRender = (record) => {
    const property = record?.inventory?.distributes?.length
    ? record?.inventory?.distributes[0]?.element_distributes
    : [];
    if (property && !property.length) return null;
    return (
      <div>
        {property ? (
          <>
            <div className="flex w-full flex-col gap-y-3 pl-[196px] pr-[16px] py-3 bg-[#BEE1FF4D]">
              {property?.length > 0
                ? property?.map((p) => {
                    if (
                      p.name !== "" &&
                      p.name !== null &&
                      (p.sub_element_distributes?.length === 0 ||
                        (p.sub_element_distributes?.length > 0 &&
                          p.sub_element_distributes.some(
                            (productChild) =>
                              productChild.name !== "" &&
                              productChild.name !== null
                          ) === false))
                    ) {
                      return (
                        <div
                          className="w-full flex items-center justify-between"
                          key={p.id}
                        >
                          <div className="flex items-center">
                            <div className="w-[150px] pr-4 text-center">
                              <Image
                                src={p.image_url || defaultImage}
                                width={50}
                                height={50}
                                className="object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[200px] pr-4 ml-2">
                              <span>Phân loại: </span>
                              <span className="font-medium">{p.name}</span>
                            </div>
                          </div>
                          <div className="flex">
                            <div className="flex gap-4 justify-between px-[56px] w-[200px]">
                              {formatNumber(p.stock || 0)}
                              <div>
                                <Tooltip
                                  title="Sửa số lượng tồn kho"
                                  color={"blue"}
                                >
                                  <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    bordered="true"
                                    canceltext="Hủy"
                                    oktext="Cập nhật"
                                    onClick={() => {
                                      setOpenDrawer(true);
                                      setUpdateParams((prev) => ({
                                        ...prev,
                                        stock: p.stock || 0,
                                        product_id: record.id,
                                        distribute_name: record.inventory.distributes[0].name || "",
                                        element_distribute_name: p.name,
                                        sub_element_distribute_name: ""
                                      }));
                                    }}
                                  ></Button>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="w-[184px] pl-4">
                              <span className="">
                                {formatNumber(p.price)} đ
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (p.name !== "" && p.name !== null) {
                      return p.sub_element_distributes.map((productChild) => {
                        return (
                          <div
                            className="w-full flex items-center justify-between"
                            key={productChild.id}
                          >
                            <div className="flex items-center">
                              <div className="w-[150px] pr-4 text-center">
                                <Image
                                  src={p.image_url || defaultImage}
                                  width={50}
                                  height={50}
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div className="w-[200px] pr-4 ml-2">
                                <span>Phân loại: </span>
                                <span className="font-medium">
                                  {`${p.name}${
                                    productChild.name
                                      ? ` - ${productChild.name}`
                                      : ""
                                  }`}
                                </span>
                              </div>
                            </div>
                            <div className="flex">
                              <div className="flex gap-4 justify-between px-[56px] w-[200px]">
                                {formatNumber(
                                  productChild.stock || 0
                                )}
                                <div>
                                  <Tooltip
                                    title="Sửa số lượng tồn kho"
                                    color={"blue"}
                                  >
                                    <Button
                                      size="small"
                                      icon={<EditOutlined />}
                                      bordered="true"
                                      canceltext="Hủy"
                                      oktext="Cập nhật"
                                      onClick={() => {
                                        setOpenDrawer(true);
                                        setUpdateParams((prev) => ({
                                          ...prev,
                                          stock: productChild.stock,
                                          product_id: record.id,
                                          distribute_name: record.distributes[0].name || "",
                                          element_distribute_name: p.name,
                                          sub_element_distribute_name: productChild.name
                                        }));
                                      }}
                                    ></Button>
                                  </Tooltip>
                                </div>
                              </div>
                              <div className="w-[184px] pl-4">
                                <span className="">
                                  {formatNumber(productChild.price)} đ
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    } else {
                      return <div key={p.id}></div>;
                    }
                  })
                : null}
            </div>
          </>
        ) : null}
      </div>
    );
  };
  const productsTable = [
    {
      title: "Mã SKU",
      dataIndex: "sku",
      key: "sku",
      width: "100px",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      align: "center",
      width: "150px",
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name, product) => (
        <p className="text-[#0e2482] font-medium cursor-pointer">
          <Link to={`/products/edit/${product.id}`}>{name}</Link>
        </p>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "inventory",
      align: "center",
      key: "inventory",
      editable: true,
      render: (_, product) => {
        if (product?.distributes && product?.distributes?.length) return null;

        return (
          <div className="flex gap-4 justify-between px-10">
            {formatNumber(product.inventory.main_stock)}
            <div>
              <Tooltip title="Sửa số lượng tồn kho" color={"blue"}>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  bordered="true"
                  canceltext="Hủy"
                  oktext="Cập nhật"
                  onClick={() => {
                    setUpdateParams((prev) => ({...prev, product_id: product.id, stock: product.inventory.main_stock}))
                    setOpenDrawer(true);
                  }}
                ></Button>
              </Tooltip>
            </div>
          </div>
        );
      },
      width: "200px",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_, product) => (
        <div className="text-[#0e2482] font-medium">
          {formatPriceProduct(product)}
        </div>
      ),
      width: "200px",
    },
  ];

  const updateNumberInventory = () => {
    const onSuccess = () => {
      alerts.success("Cập nhật số lượng tồn kho thành công");
      setOpenDrawer(false);
      fetchDataTable(tableParams.keyword);
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    updateBalance(branchId, updateParams, onSuccess, onFail);
  };

  const renderTable = () => {
    if (loading && !products.length)
      return (
        <div className="min-h-[300px] flex justify-center items-center">
          <Spin></Spin>
        </div>
      );
    if (!products.length) return <Table
    columns={productsTable}
    loading={loading}
    dataSource={[]}
    pagination={tableParams.pagination}
  />;
    return (
      <Table
        columns={productsTable}
        expandable={{
          expandedRowRender,
          defaultExpandAllRows: true,
        }}
        onChange={handleTableChange}
        loading={loading}
        dataSource={dataProductMain.length ? dataProductMain : []}
        pagination={tableParams.pagination}
      />
    );
  };

  return (
    <div className="p-8 inventory-product">
      <div className="flex gap-2 items-center mb-5">
        <p className="font-medium">Kho</p>
        <Select
          style={{ width: 200 }}
          defaultValue={valueDefaultDropdown}
          value={branchId}
          className=""
          options={dropdownBranchOption}
          onChange={onChangDropdown}
        />
      </div>
      {renderTable()}
      <Modal
        title="Chỉnh sửa số lượng sản phẩm"
        placement="right"
        width="35vw"
        open={isOpenDrawer}
        onCancel={() => {
          setOpenDrawer(false);
          setUpdateParams(initUpdateParams);
        }}
        onOk={updateNumberInventory}
        oktext="Cập nhật"
        canceltext="Hủy"
      >
        <Spin spinning={loadingUpdate}>
          <Input
            placeholder="Số lượng tồn kho"
            value={updateParams.stock}
            onChange={(e) =>
              setUpdateParams((prev) => ({ ...prev, stock: e.target.value }))
            }
            type="number"
          />
        </Spin>
      </Modal>
    </div>
  );
}
