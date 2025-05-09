import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbarlinks() {
	return (
		<div className="navbar-links">
			<Link to="/work">Work</Link>
			<Link to="/about">About</Link>
		</div>
	);
}
