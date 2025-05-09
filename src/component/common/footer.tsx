import {
	EnvironmentOutlined,
	HomeOutlined,
	InsertRowAboveOutlined,
	MoneyCollectOutlined,
	ShoppingCartOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/footer.css";
import Menu from "./menu";
import "../style/orderSummary.css"
import { useAuth } from "context/AuthContext";
import SideMenu from "./menu";
import { Flex } from "antd";
import { UserRole } from "enum/common";

const
	Footer = () => {
		const { pathname } = useLocation();

		const [isOpen, setIsOpen] = useState(false);

		const toggleSidebar = () => {
			setIsOpen(!isOpen);
		};

		const { authState } = useAuth();

		return (
			<footer className="footerRespons">
				<ul className="m-0">
					<li className={pathname.includes("/dashboard") || pathname.includes("/home") ? "active-home" : ""}>
						<Link 
						to={authState?.user?.role === UserRole.SSM ? "/home" : authState?.user?.role === UserRole.RETAILER ? "/retailor/dashboard": "/admin/dashboard"} 
						className="link">
						<HomeOutlined className="fs-22" />
							<span>Home</span>
						</Link>
					</li>
					<li className={pathname.includes(`/visit`) ? "active-visit" : ""}>
						<Link 
						to={authState?.user?.role === "SSM" ? "/visit" : "/admin/visit"}
						className="link"
						>
							<EnvironmentOutlined className="fs-22" />
							<span>Visit</span>
						</Link>
					</li>
					<li className={pathname.includes(`/order`) ? "active-order" : ""}>
						<Link to="/order">
							<ShoppingCartOutlined className="fs-22" />
							<span>Order</span>
						</Link>
					</li>
					<li className={pathname.includes("/stores") ? "active-store" : ""}>
						<Link to= "/stores">
							<InsertRowAboveOutlined className="fs-22"  />
							<span>Dr./Chem</span>
						</Link>
					</li>
					<li >
						<button onClick={toggleSidebar} className="hamburger humb" id="hamburger-1">
							<span className="line"></span>
							<span className="line"></span>
							<span className="line"></span>
							<span className="footerTxtColor">Menu</span>

						</button>
					</li>
				</ul>
				<SideMenu isOpen={isOpen} toggleSidebar={toggleSidebar} />
			</footer>

		);
	};

export default Footer;
