import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import { statusIdentity, stepIdentityStatus } from "..";
import { CircleCheck, CircleClose, CircleThreeDot } from "../../assets/icons";

export const identityTable = [
  {
    title: "ID",
    dataIndex: "user_id",
    key: "user_id",
    fixed: "left",
    sorter: (identity1, identity2) => +identity1.user_id - +identity2.user_id,
  },
  {
    title: "Tên công ty",
    dataIndex: "company_name",
    key: "company_name",
    sorter: (identity1, identity2) =>
      identity1.company_name.localeCompare(identity2.company_name),
    fixed: "left",
    render: (name, identity) => (
      <p
        className="text-[#0e2482] font-medium cursor-pointer"
      >
        <Link to={`/identity-request/${identity.user_id}`}>
          {name}
        </Link>
      </p>
    ),
  },
  {
    title: "Mã số thuế",
    dataIndex: "tax_code",
    key: "tax_code",
    sorter: (identity1, identity2) =>
      identity1.tax_code.localeCompare(identity2.tax_code),
  },
  {
    title: "Số điện thoại",
    key: "phone_number",
    dataIndex: "phone_number",
  },
  {
    title: "Tên shop",
    dataIndex: "shop_name",
    key: "shop_name",
    sorter: (identity1, identity2) =>
      identity1.shop_name.localeCompare(identity2.shop_name),
  },
  {
    title: "Định danh thông tin",
    dataIndex: "Trạng thái",
    key: "status",
    align: "center",
    render: (_, identity) => {
      const {
        status_account_payment,
        status_shop,
        status_supplier,
        status_warehouse,
        status,
      } = identity;

      const handleStepStatus = (stepStatus) => {
        switch (stepStatus) {
          case stepIdentityStatus.APPROVED:
            return (
              <Tooltip title="Đồng ý" color="#27AE60">
                <CircleCheck className="w-[16px] h-[16px] text-[#27AE60]" />
              </Tooltip>
            );
          case stepIdentityStatus.UNAPPROVED:
            return (
              <Tooltip title="Từ chối" color="#E83A2F">
                <CircleClose className="w-[16px] h-[16px] text-[#E83A2F]" />
              </Tooltip>
            );
          case stepIdentityStatus.PROGRESSING:
            return (
              <Tooltip title="Đang chờ" color="#F0AD00">
                <CircleThreeDot className="w-[16px] h-[16px] text-[#F0AD00]" />
              </Tooltip>
            );
          default:
            return (
              <Tooltip title="chưa có dữ liệu" color="#ccc">
                <CircleThreeDot className="w-[16px] h-[16px] text-[#ccc]" />
              </Tooltip>
            );
        }
      };
      return (
        <div className="flex gap-[4px] justify-center">
          {handleStepStatus(status_supplier)}
          {handleStepStatus(status_shop)}
          {handleStepStatus(status_warehouse)}
          {handleStepStatus(status_account_payment)}
          {handleStepStatus(status)}
        </div>
      );
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "Trạng thái",
    key: "status",
    align: "center",
    filters: [
      { key: 1, text: "Chờ duyệt", value: statusIdentity.PROGRESSING },
      {
        key: 2,
        text: "Đã hủy",
        value: statusIdentity.UNAPPROVED,
      },
      {
        key: 3,
        text: "Đã duyệt",
        value: statusIdentity.APPROVED,
      },
    ],
    onFilter: (value, identity) => identity.status === value,
    render: (_, identity) => {
      if (identity.status === statusIdentity.APPROVED)
        return (
          <div className="border-[#27AE60] border-solid text-[#27AE60] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#27AE601A]">
            Đã duyệt
          </div>
        );
      if (identity.status === statusIdentity.UNAPPROVED)
        return (
          <div className="border-[#E83A2F] border-solid text-[#E83A2F] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#E83A2F1A]">
            Đã hủy
          </div>
        );
      return (
        <div className="border-[#F0AD00] border-solid text-[#F0AD00] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#F0AD001A]">
          Chờ duyệt
        </div>
      );
    },
  },
];
