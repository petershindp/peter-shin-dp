import { Link, NavLink } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbarlinks() {
	return (
		<div className="navbar-links">
			<NavLink
				to="/"
				className={({ isActive }) =>
					isActive || location.pathname === "/" ? "active-link" : ""
				}
			>
				Work
			</NavLink>
			<NavLink
				to="/about"
				className={({ isActive }) => (isActive ? "active-link" : "")}
			>
				About
			</NavLink>
		</div>
	);
}
