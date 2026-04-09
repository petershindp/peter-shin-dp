import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@sanity/client";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../styles/Work.css";
import { SANITY_DATASET_NAME, SANITY_PROJECT_ID } from "../Constants";
import imageUrlBuilder from "@sanity/image-url";
import "lazysizes";

// Initialize Sanity client
const sanityClient = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET_NAME,
	apiVersion: "2023-01-01", // Use the latest API version
	useCdn: true, // Use the CDN for faster response times
});

// Initialize the image URL builder
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
	return builder.image(source);
}

// Helper function to get responsive thumbnail width
const getThumbnailWidth = () => {
	const width = window.innerWidth;
	const pixelRatio = window.devicePixelRatio || 1;

	// Account for device pixel ratio and padding
	const availableWidth = width - 32; // Subtract padding (1rem = 16px * 2)

	if (width < 768) {
		// Mobile: use higher resolution for retina displays
		return Math.min(Math.ceil(availableWidth * pixelRatio * 1.2), 800); // Max 800px
	}
	if (width < 1200) {
		// Tablet: 2 columns
		const columnWidth = (availableWidth - 64) / 2; // Subtract gap
		return Math.min(Math.ceil(columnWidth * pixelRatio * 1.2), 1000); // Max 1000px
	}
	// Desktop: 3 columns
	const columnWidth = (availableWidth - 128) / 3; // Subtract gaps
	return Math.min(Math.ceil(columnWidth * pixelRatio * 1.2), 1200); // Max 1200px
};

const ProjectCard = ({ item }) => {
	const containerRef = useRef(null);
	const videoRef = useRef(null);
	const [videoSrc, setVideoSrc] = useState(null);
	const [isTouchPlaying, setIsTouchPlaying] = useState(false);
	const [supportsHover, setSupportsHover] = useState(true);

	// Lazy load video when element enters viewport
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// Load video source only when in viewport
					setVideoSrc(item.videoUrl);
					observer.unobserve(entry.target);
				}
			},
			{ rootMargin: "50px" }, // Start loading 50px before entering viewport
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, [item.videoUrl]);

	// Detect if device supports hover (cursor/trackpad)
	useEffect(() => {
		// Check if device has hover capability using media query
		const mediaQuery = window.matchMedia("(hover: hover)");
		setSupportsHover(mediaQuery.matches);

		const handleChange = (e) => {
			setSupportsHover(e.matches);
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const handleMouseEnter = () => {
		if (supportsHover && videoRef.current) {
			videoRef.current.currentTime = 0;
			videoRef.current.play().catch(() => {
				// Silently handle play failures (browsers may block autoplay)
			});
		}
	};

	const handleMouseLeave = () => {
		if (supportsHover && videoRef.current) {
			videoRef.current.pause();
		}
	};

	const handleTouchStart = () => {
		// Only use touch if hover is not supported
		if (!supportsHover && videoRef.current) {
			if (isTouchPlaying) {
				videoRef.current.pause();
				setIsTouchPlaying(false);
			} else {
				videoRef.current.currentTime = 0;
				videoRef.current.play().catch(() => {
					// Silently handle play failures (browsers may block autoplay)
				});
				setIsTouchPlaying(true);
			}
		}
	};

	return (
		<Link
			to={`/project/${item.projectId}`}
			className="grid-item"
			tabIndex="0"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onTouchStart={handleTouchStart}
			ref={containerRef}
		>
			<div className="media-wrapper">
				<img
					src={urlFor(item.thumbnail).width(getThumbnailWidth()).url()}
					data-src={urlFor(item.thumbnail).width(getThumbnailWidth()).url()}
					alt={item.title}
					className="thumbnail lazyload"
					loading="lazy"
					onLoad={(e) => e.target.parentElement.classList.add("loaded")}
				/>
				<div className="preview-container">
					<div className="preview-title">{item.title}</div>
					{videoSrc && (
						<video
							ref={videoRef}
							src={videoSrc}
							className="video-preview"
							muted
							loop
							playsInline
							controls={false}
							preload="none"
						/>
					)}
				</div>
			</div>
		</Link>
	);
};

export default function Work() {
	const [projects, setProjects] = useState([]);

	// Fetch data from Sanity
	useEffect(() => {
		sanityClient
			.fetch(
				`*[_type == "project" && !hide] | order(order asc){
					projectId,
					title,
					"videoUrl": videoFile.asset->url,
					thumbnail
				}`,
			)
			.then((data) => setProjects(data))
			.catch((error) => console.error("Error fetching data:", error));
	}, []);

	console.log("Fetched projects:", projects);

	return (
		<div className="grid-container">
			{projects.map((item) => (
				<ProjectCard key={item.projectId} item={item} />
			))}
		</div>
	);
}
