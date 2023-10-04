import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Col, Dropdown, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoImage from '../../assets/icons/NoImage.jsx';
import DefaultAvatar from '../../assets/images/image-default.jpg';
import { useAuthStore } from '../../store/authStore';
import { useInfoStore } from '../../store/infoStore.js';
import { StyledHeader } from './Index.style';
import { alerts } from '../../utils/alerts.js';

const Header = ({ collapsed, changeCollapsed }) => {
  const { logOut } = useAuthStore((state) => state);
  const { userData, storeData, getInfoStore } = useInfoStore((state) => state);
  const items = [
    { key: 'link-to-profile', label: <Link to="/store-info">Tài khoản</Link> },
    {
      key: 'Đăng xuất',
      label: (
        <Link to="/login" onClick={logOut}>
          Đăng xuất
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };
    getInfoStore(onSuccess, onFail);
  }, [userData]);

  return (
    <StyledHeader>
      <div className="flex justify-between">
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          onClick: () => changeCollapsed(),
        })}
        <div className="w-fit">
          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <div className="flex h-[40px] items-center justify-between gap-3 cursor-pointer">
              <div className="flex flex-col items-end">
                <p className="h-[18px] font-semibold leading-[18px] text-[16px]">
                  {storeData?.name ? storeData?.name : storeData?.phone_number}
                </p>
                <p className="h-[16px] leading-[16px] text-[#999]">
                  {userData?.name ? userData?.name : userData?.phone_number}
                </p>
              </div>
              {userData?.avatar_image ? (
                <Avatar
                  src={userData?.avatar_image || DefaultAvatar}
                  style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                  alt="avatar"
                ></Avatar>
              ) : storeData?.user?.avatar_image ? (
                <Avatar
                  src={storeData?.user?.avatar_image}
                  style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                  alt="avatar"
                ></Avatar>
              ) : (
                <NoImage />
              )}
            </div>
          </Dropdown>
        </div>
      </div>
    </StyledHeader>
  );
};

export default Header;

Header.propTypes = {
  collapsed: PropTypes.bool,
  changeCollapsed: PropTypes.func.isRequired,
};
