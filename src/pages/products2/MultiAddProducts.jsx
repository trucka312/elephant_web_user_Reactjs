import { Col, Row, Table, Tabs, Progress, Card, Button, Image, ConfigProvider, List, Popover } from 'antd';
import { useEffect, useState } from 'react';
import Dragger from 'antd/es/upload/Dragger.js';
import { CloudUploadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

import { alerts } from '../../utils/alerts.js';
import { useProductsStore } from '../../store/productsStore.js';
import ContentHeader from '../../components/content-header/index.jsx';
import defaultImage from '../../assets/images/image-default.jpg';
import { formatDate } from '../../utils/date.js';
import { constants as c } from '../../constants';
import { getToken } from '../../utils/auth.js';
import { formatPriceProduct } from '../../utils/product.jsx';
import ModalYesNo from '../../components/common/Modal/ModalYesNo/index.jsx';

const MultiAddProducts = () => {
  const navigate = useNavigate;
  const customerTokenKey = getToken();
  const {
    historyImportFiles,
    products,
    loading,
    loadingProductFile,
    updateProductFiles,
    getAllHistoryImportFiles,
    pushSingleProductsFile,
    getAllProducts,
  } = useProductsStore((state) => state);

  // state for table products pushed
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // state for prosessing ui
  const [isUploading, setIsUploading] = useState(false);
  const [showProsesing, setShowProsesing] = useState(false);
  const [percent, setPercent] = useState(0);
  const [loadingItem, setLoadingItem] = useState(false);

  // state for prosessing logic
  const [isPaused, setIsPaused] = useState(false);
  const [idxCurrent, setIdxCurrent] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [fileName, setFileName] = useState('');

  // state for logic UI
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [isContinueButtonDisabled, setIsContinueButtonDisabled] = useState(true);
  const [failedProductIds, setFailedProductIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tableProductsPushedParams, setTableProductsPushedParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  // ui cpn
  const text = <span>Ấn vào ID sản phẩm tương ứng để sửa !</span>;
  const content =
    failedProductIds?.length &&
    failedProductIds.map((item, idx) => (
      <div key={idx} className="border border-solid border-[#e7e7e7] border-t-0 border-x-0 py-3">
        <Link to={`/products/edit/${item?.product_id}`} className="font-semibold">
          ID: {item.product_id}
        </Link>
        <p>
          Mã lỗi: <span className="text-[#ED3237]">{item.name_error}</span>
        </p>
        <p>Giá trị lỗi: {item.value_error}</p>
        <p>thẻ p</p>
        <div className="">thẻ div</div>
      </div>
    ));

  useEffect(() => {
    if (isPaused === false && idxCurrent <= totalRow) {
      setLoadingItem(true);
      const params = { idx_row: idxCurrent, name_file: fileName };
      pushSingleProductsFile(
        params,
        () => {
          setIdxCurrent(idxCurrent + 1);
          setPercent(Math.floor((idxCurrent / totalRow) * 100));
          setIsUploading(false);
          setLoadingItem(false);
        },
        () => {
          setIdxCurrent(idxCurrent + 1);
          setLoadingItem(false);
          setIsUploading(false);
        },
      );
      if (percent == 100) {
        getAllHistoryImportFiles();
      }
    } else return;
  }, [idxCurrent, isPaused]);

  useEffect(() => {
    getAllHistoryImportFiles();
  }, [navigate]);

  useEffect(() => {
    getAllProducts(
      '',
      '',
      tableProductsPushedParams.pagination.current || 1,
      (response) => {
        setTableProductsPushedParams({
          pagination: {
            ...tableProductsPushedParams.pagination,
            total: response.total,
          },
        });
      },
      () => {},
      '',
      true,
    );
  }, [navigate, tableProductsPushedParams.pagination.current]);

  // initial datafor histoty table
  const dataTableProductsPushed =
    products &&
    products.length &&
    products.map((item, index) => {
      return {
        key: index.toString(),
        ...item,
      };
    });

  const handleContinue = (record) => {
    // check is calling sigle file ?
    if (loadingItem) {
      alerts.error('Vui lòng đợi cho đến khi tiến trình tải lên file hiện hành hoàn tất hoặc dừng nó lại.');
      return;
    }

    // check is uploading file ?
    if (isUploading) {
      alerts.error('Vui lòng đợi cho đến khi tiến trình tải lên file diễn ra hoàn tất.');
      return;
    }

    // call apis here
    const { total_row, idx_current, name_file } = record;
    setIdxCurrent(idx_current);
    setFileName(name_file);
    setTotalRow(total_row);
    setIsPaused(false);
    setShowProsesing(true);
  };

  // handle pause call single row
  const pauseUpload = () => {
    setIsPaused(true);
    setLoadingItem(true);
    getAllHistoryImportFiles();
  };

  // handle continue call single row
  const resumeUpload = () => {
    setIsPaused(false);
    setLoadingItem(true);
  };

  const handleStopUploadingFile = () => {
    alerts.success(
      'Tiến trình tải lên file của bạn sẽ dừng sau 5s, để tiếp tục tải lên bạn có thể click vào nút "Tiếp tục" ở bảng bên dưới',
    );
    setIsPaused(true);
    setIsContinueButtonDisabled(false);
    setTimeout(() => {
      setLoadingItem(false);
      setPercent(0);
      setFileName('');
      setIdxCurrent(0);
      setTotalRow(0);
      setShowProsesing(false);
      setIsUploading(false);
      setIsContinueButtonDisabled(true);
    }, 5000);
  };

  // initial columns for history table
  const tableHistorycolumns = [
    {
      title: 'Ngày',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (_, record) => <p>{formatDate(record?.created_at, 'DD-MM-YYYY')}</p>,
      width: '15%',
    },
    {
      title: 'Tên File',
      dataIndex: 'name_file',
      key: 'name_file',
      width: '45%',
    },
    {
      title: 'Sản Phẩm',
      dataIndex: 'total_failed',
      key: 'total_failed',
      render: (_, record) => {
        if (record.name_file === fileName) {
          if (idxCurrent == 1) {
            return (
              <p>
                {record.idx_current}/{record?.total_row}
              </p>
            );
          } else {
            return (
              <p>
                {idxCurrent - 1 < 0 ? 0 : idxCurrent - 1}/{record?.total_row}
              </p>
            );
          }
        } else {
          return (
            <p>
              {record?.idx_current}/{record?.total_row}
            </p>
          );
        }
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        let statusComponent;
        switch (record?.status) {
          case 0:
            statusComponent = <p className="text-[#9de95a]">Chờ xử lí</p>;
            break;
          case 1:
            statusComponent = <p className="text-[#e35555]">Thất bại</p>;
            break;
          case 2:
            statusComponent = <p className="text-[#53b553]">Thành công</p>;
            break;
          default:
            statusComponent = <p className="text-[#333]">Xảy ra lỗi khi tải lên</p>;
            break;
        }
        return <>{statusComponent}</>;
      },
    },
    {
      title: 'Hành động',
      key: 'id',
      render: (_, record) => {
        if (record?.idx_current < record?.total_row) {
          return (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  handleContinue(record);
                }}
                disabled={(percent > 0 && percent < 100) || isUploading}
              >
                Tiếp tục
              </Button>
            </>
          );
        }
        return null;
      },
    },
    {
      title: 'SP thất bại',
      key: 'id',
      render: (_, record) => {
        if ((record?.product_failed, record)) {
          return (
            <Popover placement="left" title={text} content={content} trigger="click" controlHeight={500}>
              <Button
                type="primary"
                className="relative"
                size="small"
                onClick={() => handleViewFailedProducts(record?.product_failed)}
              >
                Xem
              </Button>
            </Popover>
          );
        }
        return null;
      },
    },
  ];

  // handle changle tab key
  const handleTabChange = (key) => {
    setActiveTabKey(key);
    if (key === '2') {
      getAllProducts(
        '',
        '',
        tableProductsPushedParams.pagination.current || 1,
        (response) => {
          setTableProductsPushedParams({
            pagination: {
              ...tableProductsPushedParams.pagination,
              total: response.total,
            },
          });
        },
        () => {},
        '',
        true,
      );
    }
  };

  const handleTableChange = (pagination) => {
    setTableProductsPushedParams({
      pagination: {
        ...tableProductsPushedParams.pagination,
        current: pagination.current,
      },
    });
  };

  //initial data for pushed products
  const TablePushedcolumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name, product) => (
        <p className="text-[#0e2482] font-medium cursor-pointer">
          <Link to={`/products/edit/${product?.id}`}>{name}</Link>
        </p>
      ),
    },
    {
      title: 'Mã SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Mô tả sản phẩm',
      dataIndex: 'description',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      align: 'center',
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
      title: 'Cân nặng(gr)',
      dataIndex: 'weight',
      render: (_, record) => <p>{record?.weight}gr</p>,
    },
    {
      title: 'Kích thước D/R/C (cm)',
      dataIndex: 'width',
      render: (_, record) => (
        <p>
          {record?.length}/{record?.width}/{record?.height}(cm)
        </p>
      ),
    },
    {
      title: 'Tên kho',
      dataIndex: 'branch_name',
    },
    {
      title: 'Giá SP (vnd)',
      dataIndex: 'price',
      render: (_, record) => <p>{formatPriceProduct(record)}</p>,
    },
  ];

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handlePushingClick = () => {
    if (selectedRows.length == 0) {
      alerts.error('Bạn chưa chọn sản phẩm');
    } else {
      setShowModal(true);
    }
  };

  // initial tab item
  const itemTab = [
    {
      key: '1',
      label: 'File đã tải lên',
      children: (
        <Table
          dataSource={historyImportFiles?.length ? historyImportFiles : []}
          columns={tableHistorycolumns}
          loading={loading}
        />
      ),
    },
    {
      key: '2',
      label: 'Sản phẩm chưa được đăng',
      children: (
        <div>
          <p className="text-[#db5858] mb-2">Ấn vào tên sản phẩm để chỉnh sửa thông tin sản phẩm</p>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#9494ec',
                colorBgContainer: '#ffffff',
              },
              components: {
                Table: {
                  rowSelectedBg: '#f5f5f5',
                },
              },
            }}
          >
            <Table
              rowSelection={rowSelection}
              columns={TablePushedcolumns}
              dataSource={dataTableProductsPushed?.length ? dataTableProductsPushed : []}
              onChange={handleTableChange}
              scroll={{ x: true }}
              loading={loadingProductFile}
              pagination={tableProductsPushedParams.pagination}
            />
          </ConfigProvider>
          <Button type="primary" className="my-6 ml-[90%]" onClick={handlePushingClick}>
            Đẩy lên sàn
          </Button>
        </div>
      ),
    },
  ];

  const handleBeforeUpload = (file) => {
    const maxSize = 10 * 1024 * 1024; // Kích thước tối đa cho phép (10MB)

    if (file.size > maxSize) {
      alerts.error('Kích thước tệp quá lớn. Vui lòng chọn một tệp có dung lượng dưới 10MB.');
      return false;
    }

    if (isUploading) {
      alerts.error('Vui lòng đợi cho đến khi tiến trình tải lên file diễn ra hoàn tất.');
      return false;
    }

    if (loadingItem) {
      alerts.error('Vui lòng đợi cho đến khi tiến trình tải lên file hiện hành hoàn tất hoặc dừng nó lại.');
      return false;
    }

    return true;
  };

  // logic call apis push file and logic ui prossesing
  const props = {
    name: 'excel',
    maxCount: 1,
    accept: '.xlsx, .xls, .csv',
    action: `${c.API_URL}/store/v1/products/import_excel`,
    headers: { 'customer-token': customerTokenKey },
    method: 'POST',
    beforeUpload: handleBeforeUpload,
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        alerts.success('Thêm file thành công, tiến trình tải lên file đang diễn ra');
        setIsUploading(true); // uploading only 1 file
        setPercent(0);
        setShowProsesing(true); // show prosesing card
        setIsPaused(false);
        // re get history table data to refesh data
        getAllHistoryImportFiles();
        const totalRow = info.file.response.data.total;
        const fileName = info.file.response.data.name_file;
        const idxCurrent = info.file.total_row_ignore;
        console.log('idxCurrent', idxCurrent);
        // set state to re call apis call every single products row here
        setTotalRow(totalRow);
        setFileName(fileName);
        setIdxCurrent(0);
      } else if (status === 'error') {
        alerts.error('Tải lên thư mục thất bại. Xin vui lòng thử lại!');
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleCreateEverySingleProducts = () => {
    if (selectedRows.length == 0) {
      alerts.error('Bạn chưa chọn sản phẩm');
    } else {
      // get arr id to put request change status to 0
      const selectedIds = { product_ids: selectedRows.map((row) => row.id) };
      updateProductFiles(
        selectedIds,
        () => {
          alerts.success('Danh sách sản phẩm của bạn được đẩy lên thành công, đang chờ admin duyệt')
          // when push success => recall api to update data table pushed products
          getAllProducts(
            '',
            '',
            tableProductsPushedParams.pagination.current || 1,
            (response) => {
              setTableProductsPushedParams({
                pagination: {
                  ...tableProductsPushedParams.pagination,
                  total: response.total,
                },
              });
            },
            () => {},
            '',
            true,
          );
        },
        (err) => {
          alerts.error(err || 'Có lỗi xảy ra khi tải lên file sản phẩm của bạn. Vui lòng thử lại')
        },
      );

      setShowModal(false);
    }
  };

  const handleViewFailedProducts = (record) => {
    setFailedProductIds(record);
  };

  return (
    <Row className="block">
      <Row>
        <Col>
          <ContentHeader title="Thêm hàng loạt" />
        </Col>
      </Row>

      {showModal && (
        <ModalYesNo
          title="Xác nhận đẩy lên sàn"
          text={`Bạn có chắc chắn muốn đẩy ${selectedRows.length} sản phẩm?`}
          handleConfirm={handleCreateEverySingleProducts}
          handleCancel={() => {
            setShowModal(false);
          }}
          handleVisible={showModal}
        />
      )}

      {showModal && (
        <ModalYesNo
          title="Gì đó 2"
          content={content}
          handleConfirm={handleCreateEverySingleProducts}
          handleCancel={() => {
            setShowModal(false);
          }}
          handleVisible={showModal}
        />
      )}

      <Row className="mt-[15px] mx-auto w-[90%]">
        <Col span={24}>
          <p className="pb-4">
            Sau khi hoàn thành chỉnh sửa, vui lòng đăng tập tin Excel lên. Bạn có thể kiểm tra những sản phẩm mới tạo 1
            lần nữa ở mục "Sản phẩm Chưa được đăng" trước khi chọn Đẩy lên sàn.
          </p>
          {/* drag and dropped area */}
          <Dragger
            {...props}
            className="mt-[100px] mr-4 inset-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#f5f5f5] border w-full h-[180px]"
          >
            <p className="ant-upload-drag-icon ">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">Chọn hoặc kéo file excel vào đây </p>
            <p className="text-[#c4c4c4]">Kích thước file tối đa: 10MB</p>
            <p className="text-[#e34e4e]">Lưu ý file tải lên phải theo định dạng là file excel !</p>
          </Dragger>
        </Col>
      </Row>

      <Row className="mt-[35px] mx-auto w-[90%]">
        <Col span={24} className="mt-10">
          {/* proses area */}
          {showProsesing && percent < 100 && (
            <Card
              title="Tiến trình tải lên file của bạn đang diễn ra"
              bordered={false}
              style={{
                width: '100%',
                margin: '30px 0',
                border: '1px solid #f5f5f5',
              }}
            >
              <p className="my-2 font-semibold">{fileName}</p>
              <p className="my-2">
                Đang xử lí: {idxCurrent}/{totalRow}
              </p>
              {percent == 100 ? (
                <Progress type="circle" percent={percent} style={{ marginLeft: '35%' }} />
              ) : (
                <Progress percent={percent} status="active" />
              )}
              <div className="mt-[8px]">
                <Button type="primary" onClick={pauseUpload} disabled={isPaused}>
                  Tạm dừng
                </Button>
                {isContinueButtonDisabled && (
                  <Button className="ml-2" type="primary" onClick={resumeUpload} disabled={!isPaused}>
                    Tiếp tục
                  </Button>
                )}
                <Button className="ml-2" danger onClick={handleStopUploadingFile}>
                  Hủy tải lên file
                </Button>
              </div>
            </Card>
          )}

          <Tabs
            defaultActiveKey="1"
            type="card"
            activeKey={activeTabKey}
            onChange={handleTabChange}
            items={itemTab}
            className="my-6"
          />
        </Col>
      </Row>
    </Row>
  );
};

export default MultiAddProducts;
