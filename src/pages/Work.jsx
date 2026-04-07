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
	if (width < 768) return 480; // Mobile: 480px
	if (width < 1200) return 720; // Tablet: 720px
	return 1200; // Desktop: 1200px (reduced from 1920)
};

const ProjectCard = ({ item }) => {
	const containerRef = useRef(null);
	const videoRef = useRef(null);
	const [videoSrc, setVideoSrc] = useState(null);

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

	const handleMouseEnter = () => {
		if (videoRef.current) {
			videoRef.current.currentTime = 0;
			videoRef.current.play().catch(() => {
				// Silently handle play failures (browsers may block autoplay)
			});
		}
	};

	const handleMouseLeave = () => {
		if (videoRef.current) {
			videoRef.current.pause();
		}
	};

	return (
		<Link
			to={`/project/${item.projectId}`}
			className="grid-item"
			tabIndex="0"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
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

	return (
		<div className="grid-container">
			{projects.map((item) => (
				<ProjectCard key={item.projectId} item={item} />
			))}
		</div>
	);
}
