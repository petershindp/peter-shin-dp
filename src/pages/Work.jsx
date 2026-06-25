import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Work.css";
import { sanityClient, urlFor } from "../sanity";

const ProjectCard = ({ item }) => {
	const containerRef = useRef(null);
	const videoRef = useRef(null);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const [imgLoaded, setImgLoaded] = useState(false);
	const [supportsHover, setSupportsHover] = useState(true);
	const [isTouchPlaying, setIsTouchPlaying] = useState(false);
	const [pendingPlay, setPendingPlay] = useState(false);
	// Tracks whether the next click event was preceded by a touchstart that started the preview
	const touchJustStartedRef = useRef(false);

	// Detect hover capability once on mount
	useEffect(() => {
		const mq = window.matchMedia("(hover: hover)");
		setSupportsHover(mq.matches);
		const handler = (e) => setSupportsHover(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	// Lazy-load video src via IntersectionObserver — only when near viewport
	useEffect(() => {
		if (!item.videoUrl) return;
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
	}, [item.videoUrl]);

	// Play video after it's rendered into the DOM when a touch triggered load
	useEffect(() => {
		if (pendingPlay && videoRef.current) {
			videoRef.current.currentTime = 0;
			videoRef.current.play().catch(() => {});
			setPendingPlay(false);
		}
	}, [pendingPlay, videoLoaded]);

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

	const handleTouchStart = () => {
		if (!supportsHover && item.videoUrl && !isTouchPlaying) {
			touchJustStartedRef.current = true;
			setIsTouchPlaying(true);
			if (videoLoaded && videoRef.current) {
				videoRef.current.currentTime = 0;
				videoRef.current.play().catch(() => {});
			} else {
				// Video element not in DOM yet — trigger load and play via effect
				setVideoLoaded(true);
				setPendingPlay(true);
			}
		}
		// If isTouchPlaying is already true, the next click will navigate normally
	};

	// Blocks navigation on the first tap so the preview can be seen;
	// the second tap lets the click through to the project page
	const handleClick = (e) => {
		if (!supportsHover && item.videoUrl && touchJustStartedRef.current) {
			e.preventDefault();
			touchJustStartedRef.current = false;
		}
	};

	// Responsive srcSet: serve the right resolution for the column width
	const thumbBase = urlFor(item.thumbnail).fit("crop").auto("format");
	const thumbSrcSet = [
		`${thumbBase.width(400).url()} 400w`,
		`${thumbBase.width(700).url()} 700w`,
		`${thumbBase.width(1000).url()} 1000w`,
	].join(", ");
	// Sizes: mobile=100vw, tablet=50vw, desktop=33vw (matching grid breakpoints)
	const thumbSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

	return (
		<Link
			to={`/project/${item.projectId}`}
			className={`grid-item${isTouchPlaying ? " touch-playing" : ""}`}
			tabIndex="0"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onTouchStart={handleTouchStart}
			onClick={handleClick}
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
					<div className="preview-title">{item.title}</div>
					{videoLoaded && item.videoUrl && (
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
