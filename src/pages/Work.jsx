import React, { useEffect, useState } from "react";
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

export default function Work() {
	const [projects, setProjects] = useState([]);

	// Fetch data from Sanity
	useEffect(() => {
		sanityClient
			.fetch(
				`*[_type == "project" && !hide] | order(order asc){
					projectId,
					title,
					"videoUrl": videoFile.asset->url, // Fetch the video file URL
					thumbnail
				}`
			)
			.then((data) => setProjects(data))
			.catch((error) => console.error("Error fetching data:", error));
	}, []);

	return (
		<div className="grid-container">
			{projects.map((item) => (
				<Link
					to={`/project/${item.projectId}`}
					key={item.projectId}
					className="grid-item"
					tabIndex="0"
				>
					<div className="media-wrapper">
						<img
							src={urlFor(item.thumbnail).width(1920).quality(100).url()} // Increase width and set quality
							data-src={urlFor(item.thumbnail).width(1920).quality(100).url()} // High-quality image
							alt={item.title}
							className="thumbnail lazyload" // Add lazyload class for lazysizes
							loading="lazy"
							onLoad={(e) => e.target.parentElement.classList.add("loaded")} // Add 'loaded' class to the parent container
						/>
						<div className="preview-container">
							<div className="preview-title">{item.title}</div>
							<video
								src={item.videoUrl}
								className="video-preview"
								muted
								loop
								autoPlay
								playsInline
								controls={false}
								onMouseEnter={(e) => {
									e.target.currentTime = 0; // Reset video to start
								}}
							/>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
