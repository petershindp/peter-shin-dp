import { Routes, Route } from "react-router-dom";
import Work from "./pages/Work";
import About from "./pages/About";
import Navbar from "./navbar/Navbar";
import ProjectDetails from "./pages/ProjectDetails";
import "./styles/App.css";

export default function App() {
	return (
		<>
			<div className="main-container">
				<Navbar />
				<div className="container">
					<Routes>
						<Route path="/" element={<Work />} />
						<Route path="/project/:id" element={<ProjectDetails />} />
						<Route path="/about" element={<About />} />
					</Routes>
				</div>
			</div>
		</>
	);
}
