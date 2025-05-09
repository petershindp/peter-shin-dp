import { Link } from "react-router-dom";

export default function DropDownMenu({ onClick }) {
	return (
		<div className="fullscreen-menu">
			<Link to="/work" onClick={onClick}>
				Work
			</Link>
			<Link to="/about" onClick={onClick}>
				About
			</Link>
		</div>
	);
}
