import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import Hamburger from "hamburger-react";
import Navbarlinks from "./Navbarlinks";
import DropDownMenu from "./DropdownMenu";
import Logo from "./Logo";

const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	// Function to handle screen size changes
	const handleResize = () => {
		if (window.innerWidth > 768) {
			setMenuOpen(false); // Close the menu if the screen size exceeds 768px
		}
	};

	// Add event listener for window resize
	useEffect(() => {
		window.addEventListener("resize", handleResize);

		// Cleanup the event listener on component unmount
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<nav className="navbar">
			<div className="navbar-content">
				<Logo />

				{/* Conditionally render links in the navbar */}
				{!menuOpen && <Navbarlinks />}

				<div className="navbar-toggle">
					<Hamburger
						toggled={menuOpen}
						toggle={setMenuOpen}
						size={20}
						color={"#000"}
					/>
				</div>
			</div>

			{/* DropDownMenu */}
			{menuOpen && (
				<DropDownMenu
					onClick={() => {
						setMenuOpen(false);
					}}
				/>
			)}
		</nav>
	);
};

export default Navbar;
