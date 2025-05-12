import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@sanity/client";
import "../styles/ProjectDetails.css";
import { SANITY_DATASET_NAME, SANITY_PROJECT_ID } from "../Constants";
import imageUrlBuilder from "@sanity/image-url";
import "lazysizes"; // Import lazysizes for lazy loading
import "lazysizes/plugins/attrchange/ls.attrchange"; // Optional: Add lazysizes plugin for attribute changes

// Initialize Sanity client
const sanityClient = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET_NAME,
	apiVersion: "2023-01-01",
	useCdn: true,
});

// Initialize the image URL builder
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
	return builder.image(source);
}

export default function ProjectDetails() {
	const { id } = useParams(); // Get the project ID from the URL
	const [project, setProject] = useState(null);

	// Fetch project details from Sanity
	useEffect(() => {
		sanityClient
			.fetch(
				`*[_type == "project" && _id == $id][0]{
                    title,
                    thumbnail,
					description,
                    stills,
                    videoLink
                }`,
				{ id }
			)
			.then((data) => setProject(data))
			.catch((error) =>
				console.error("Error fetching project details:", error)
			);
	}, [id]);

	console.log("Project Details:", project);
	if (!project) return <></>;

	return (
		<div className="project-details">
			{project.videoLink && (
				<div className="project-media">
					{/* Embed the video using an iframe if video exists */}
					<iframe
						src={project.videoLink}
						title={project.title}
						className="project-video"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
				</div>
			)}
			<div className="project-title">{project.title}</div>
			{project.description && (
				<div className="project-description">{project.description}</div>
			)}
			<div className="project-stills">
				{project.stills?.map((still, index) => (
					<img
						key={index}
						src={urlFor(still).width(50).quality(10).url()} // Low-quality placeholder
						data-src={urlFor(still).width(1920).quality(100).url()} // High-quality image
						alt={`Still ${index + 1}`}
						className="project-still lazyload" // Add lazyload class for lazysizes
					/>
				))}
			</div>
		</div>
	);
}
