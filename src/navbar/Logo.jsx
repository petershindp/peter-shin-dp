import { Link } from "react-router-dom";

export default function Logo() {
	return (
		<div className="navbar-logo">
			<Link to="/">
				<div className="logo-container">
					<div className="logo-name">Peter Shin</div>
					<div className="logo-title">Director of Photography</div>
				</div>
			</Link>
		</div>
	);
}
