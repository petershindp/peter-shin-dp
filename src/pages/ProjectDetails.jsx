import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProjectDetails.css";
import { sanityClient, urlFor } from "../sanity";

const ClipCarousel = ({ clips }) => {
	const [current, setCurrent] = useState(0);
	const videoRefs = useRef([]);
	const touchStartX = useRef(0);
	const touchStartY = useRef(0);
	const count = clips.length;

	// Play the active clip, pause all others
	useEffect(() => {
		videoRefs.current.forEach((v, i) => {
			if (!v) return;
			if (i === current) {
				v.currentTime = 0;
				v.play().catch(() => {});
			} else {
				v.pause();
			}
		});
	}, [current]);

	const prev = () => setCurrent((i) => (i - 1 + count) % count);
	const next = () => setCurrent((i) => (i + 1) % count);

	const handleTouchStart = (e) => {
		touchStartX.current = e.touches[0].clientX;
		touchStartY.current = e.touches[0].clientY;
	};

	const handleTouchEnd = (e) => {
		const dx = e.changedTouches[0].clientX - touchStartX.current;
		const dy = e.changedTouches[0].clientY - touchStartY.current;
		if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
			dx < 0 ? next() : prev();
		}
	};

	if (count === 0) return null;

	return (
		<div
			className="clip-carousel"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			<div
				className="carousel-track"
				style={{ transform: `translateX(-${current * 100}%)` }}
			>
				{clips.map((url, i) => (
					<div key={i} className="carousel-slide">
						<video
							ref={(el) => (videoRefs.current[i] = el)}
							src={url}
							className="clip-video"
							muted
							loop
							playsInline
							preload={i === 0 ? "auto" : "none"}
						/>
					</div>
				))}
			</div>

			{count > 1 && (
				<>
					<button
						className="carousel-btn carousel-prev"
						onClick={prev}
						aria-label="Previous clip"
					>
						&#8249;
					</button>
					<button
						className="carousel-btn carousel-next"
						onClick={next}
						aria-label="Next clip"
					>
						&#8250;
					</button>
					<div className="carousel-dots">
						{clips.map((_, i) => (
							<button
								key={i}
								className={`carousel-dot${i === current ? " active" : ""}`}
								onClick={() => setCurrent(i)}
								aria-label={`Clip ${i + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};

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
					"clips": clips[].asset->url
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
			{project.clips?.length > 0 && (
				<ClipCarousel clips={project.clips} />
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
