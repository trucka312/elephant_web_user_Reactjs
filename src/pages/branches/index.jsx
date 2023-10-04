import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Popconfirm, Space, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useAddressStore } from "../../store/addressStore";
import { useBranchesStore } from "../../store/branchesStore";
import { alerts } from "../../utils/alerts";
import BranchForm from "./BranchForm";

export default function Branches() {
  const {
    loading,
    getAllBranches,
    branches,
    addBranches,
    updateBranches,
    deleteBranches,
  } = useBranchesStore((state) => state);
  const { getDistrict, getWards, resetDistrictAndWard } = useAddressStore();
  const [isShowModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    getAllBranches();
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const openFormEdit = (item) => {
    setShowModal(true);
    setSelectedAddress(item);
    getDistrict(item.province, () => {
      alerts.error("Có lỗi xảy ra");
    });
    getWards(item.district, () => {
      alerts.error("Có lỗi xảy ra");
    });
  };

  const onSubmitAddressForm = (value) => {
    const onSuccess = () => {
      alerts.success(
        selectedAddress ? "Cập nhật thành công" : "Thêm thành công"
      );
      getAllBranches();
      setShowModal(false);
      setSelectedAddress(null);
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    selectedAddress
      ? updateBranches(selectedAddress.id, value, onSuccess, onFail)
      : addBranches(value, onSuccess, onFail);
  };

  const deleteBranch = (id) => {
    const onSuccess = () => {
      alerts.success("Xóa thành công");
      getAllBranches();
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    deleteBranches(id, onSuccess, onFail);
  };

  const productsTable = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: "Tên kho",
      dataIndex: "name",
      key: "name",
      render: (name, item) => (
        <p
          className="text-[#0e2482] cursor-pointer"
          onClick={() => openFormEdit(item)}
        >
          <span className="font-medium">{name}</span>
          <span className="text-[#27AE60]">
            {item.is_default_order_online && " (Mặc định)"}
          </span>
        </p>
      ),
    },
    {
      title: "Quản lý",
      dataIndex: "warehouse_manager_name",
      key: "warehouse_manager_name",
    },
    {
      title: "	Địa chỉ",
      dataIndex: "address_detail",
      key: "address_detail",
      // render: (_, product) => formatNumber(product),
    },
    {
      title: "Phường/xã",
      dataIndex: "wards_name",
      key: "wards_name",
      // render: (_, product) => {
      //   return <div>{formatNumber(product.view)}</div>;
      // },
    },
    {
      title: "Quận/huyện",
      dataIndex: "district_name",
      key: "district_name",
      // render: (_, product) => {
      //   return <div>{formatNumber(product.view)}</div>;
      // },
    },
    {
      title: "Tỉnh/thành phố",
      dataIndex: "province_name",
      key: "province_name",
      // render: (_, product) => {
      //   return <div>{formatNumber(product.view)}</div>;
      // },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, item) => {
        return (
          <div>
            <Space size="middle">
              <Tooltip title="Sửa" color={"blue"}>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => openFormEdit(item)}
                ></Button>
              </Tooltip>
              <Popconfirm
                placement="left"
                title="Bạn có chắc muốn xóa kho này?"
                onConfirm={() => deleteBranch(item.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Tooltip title="Xóa" color={"red"}>
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                  ></Button>
                </Tooltip>
              </Popconfirm>
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-8">
      <div className="text-end mb-4 flex justify-between items-center">
        <p className="text-[20px] font-medium">Danh sách kho</p>
        <Button
          type="primary"
          className="font-medium rounded-md text-sm text-center"
          onClick={handleShowModal}
          icon={<PlusOutlined />}
          ghost
        >
          Thêm kho
        </Button>
      </div>
      <Table
        columns={productsTable}
        loading={loading}
        dataSource={branches.length ? branches : []}
      />
      {isShowModal && (
        <Modal
          title={selectedAddress ? "Cập nhật thông tin kho" : "Thêm kho"}
          open={isShowModal}
          onCancel={() => {
            setShowModal(false);
            setSelectedAddress(null);
            resetDistrictAndWard();
          }}
          footer={false}
          centered
          okText="Đồng ý"
          cancelText="Hủy"
          width={800}
        >
          <BranchForm
            selectedAddress={selectedAddress}
            onSubmit={onSubmitAddressForm}
          />
        </Modal>
      )}
    </div>
  );
}
