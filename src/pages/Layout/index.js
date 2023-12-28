import { TabBar } from "antd-mobile";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./index.scss";
import {
  BillOutline,
  CalculatorOutline,
  AddCircleOutline,
} from "antd-mobile-icons";
import { useDispatch, useSelector } from "react-redux";
import { getBillList } from "@/store/modles/billStore";

const tabs = [
  {
    key: "/month",
    title: "Month bill",
    icon: <BillOutline />,
  },
  {
    key: "/new",
    title: "New",
    icon: <AddCircleOutline />,
  },
  {
    key: "/year",
    title: "Year bill",
    icon: <CalculatorOutline />,
  },
];

const Layout = () => {
  const navigate = useNavigate();
  const swithRoute = (path) => {
    console.log(path);
    navigate(path);
  };
  // 获取数据
  const dispatch = useDispatch(); // 使用useDispatch触发获得数据
  useEffect(() => {
    dispatch(getBillList());
  }, [dispatch]);

  return (
    <div className="layout">
      <div className="container">
        <Outlet />
      </div>
      <div className="footer">
        <TabBar onChange={swithRoute}>
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </div>
  );
};

export default Layout;
