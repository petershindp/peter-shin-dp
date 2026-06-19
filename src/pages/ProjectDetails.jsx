import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProjectDetails.css";
import { sanityClient, urlFor } from "../sanity";

export default function ProjectDetails() {
	const { id } = useParams();
	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		sanityClient
			.fetch(
				`*[_type == "project" && projectId == $id][0]{
					title,
					thumbnail,
					description,
					stills,
					videoLink
				}`,
				{ id },
			)
			.then((data) => {
				setProject(data);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
			});
	}, [id]);

	if (loading) return <></>;
	if (error || !project) return <></>;

	return (
		<div className="project-details">
			{project.videoLink && (
				<div className="project-media">
					<iframe
						src={project.videoLink}
						title={project.title}
						className="project-video"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>
			)}
			<div className="project-title">{project.title}</div>
			{project.description && (
				<div className="project-description">{project.description}</div>
			)}
			{project.stills?.length > 0 && (
				<div className="project-stills">
					{project.stills.map((still, index) => {
						const base = urlFor(still).fit("crop").auto("format");
						return (
							<img
								key={index}
								src={base.width(800).url()}
								srcSet={[
									`${base.width(600).url()} 600w`,
									`${base.width(1200).url()} 1200w`,
									`${base.width(1920).url()} 1920w`,
								].join(", ")}
								sizes="(max-width: 768px) 100vw, 50vw"
								alt={`${project.title} still ${index + 1}`}
								className="project-still"
								loading="lazy"
								decoding="async"
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
