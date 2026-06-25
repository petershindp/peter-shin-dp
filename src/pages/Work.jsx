import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Work.css";
import { sanityClient, urlFor } from "../sanity";

const ProjectCard = ({ item }) => {
	const containerRef = useRef(null);
	const videoRef = useRef(null);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const [imgLoaded, setImgLoaded] = useState(false);
	const [supportsHover, setSupportsHover] = useState(
		() => window.matchMedia("(hover: hover)").matches,
	);

	useEffect(() => {
		const mq = window.matchMedia("(hover: hover)");
		const handler = (e) => setSupportsHover(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	// Only lazy-load video on devices that support hover
	useEffect(() => {
		if (!item.videoUrl || !supportsHover) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVideoLoaded(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" },
		);
		if (containerRef.current) observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, [item.videoUrl, supportsHover]);

	const handleMouseEnter = () => {
		if (supportsHover && videoRef.current) {
			videoRef.current.currentTime = 0;
			videoRef.current.play().catch(() => {});
		}
	};

	const handleMouseLeave = () => {
		if (supportsHover && videoRef.current) {
			videoRef.current.pause();
		}
	};

	const thumbBase = urlFor(item.thumbnail).fit("crop").auto("format");
	const thumbSrcSet = [
		`${thumbBase.width(400).url()} 400w`,
		`${thumbBase.width(700).url()} 700w`,
		`${thumbBase.width(1000).url()} 1000w`,
	].join(", ");
	const thumbSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

	return (
		<Link
			to={`/project/${item.projectId}`}
			className="grid-item"
			tabIndex="0"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			ref={containerRef}
		>
			<div className={`media-wrapper ${imgLoaded ? "loaded" : ""}`}>
				<img
					src={thumbBase.width(700).url()}
					srcSet={thumbSrcSet}
					sizes={thumbSizes}
					alt={item.title}
					className="thumbnail"
					loading="lazy"
					decoding="async"
					onLoad={() => setImgLoaded(true)}
				/>
				<div className="preview-container">
					<div className="preview-info">
						<div className="preview-title">{item.title}</div>
						{item.projectType && (
							<div className="preview-type">{item.projectType}</div>
						)}
					</div>
					{supportsHover && videoLoaded && item.videoUrl && (
						<video
							ref={videoRef}
							src={item.videoUrl}
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
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		sanityClient
			.fetch(
				`*[_type == "project" && !hide] | order(order asc){
					projectId,
					title,
					projectType,
					"videoUrl": videoFile.asset->url,
					thumbnail
				}`,
			)
			.then((data) => {
				setProjects(data);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
			});
	}, []);

	if (error) return <div className="grid-error">Unable to load projects.</div>;

	return (
		<div className="grid-container">
			{loading
				? [...Array(6)].map((_, i) => (
						<div key={i} className="grid-item">
							<div className="media-wrapper skeleton" />
						</div>
					))
				: projects.map((item) => (
						<ProjectCard key={item.projectId} item={item} />
					))}
		</div>
	);
}
