import { Spin } from 'antd';

export default function Loading() {
    return (
        <div className="w-full h-full flex justify-center items-center">
          <Spin />
        </div>
      );
}
