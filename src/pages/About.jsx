import React, { useEffect, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { motion } from "framer-motion";
import "../styles/About.css";
import { sanityClient, urlFor } from "../sanity";
import { FaInstagram } from "react-icons/fa";

export default function About() {
	const [about, setAbout] = useState(null);

	useEffect(() => {
		sanityClient
			.fetch(`*[_type == "about"][0]{bio, photo}`)
			.then(setAbout)
			.catch(console.error);
	}, []);

	return (
		<motion.div
			className="about"
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
		>
			{about && (
				<>
					<motion.div
						className="about-photo-wrapper"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
					>
						<img
							src={urlFor(about.photo).width(800).height(1000).fit("crop").auto("format").url()}
							srcSet={[
								`${urlFor(about.photo).width(420).height(520).fit("crop").auto("format").url()} 420w`,
								`${urlFor(about.photo).width(800).height(1000).fit("crop").auto("format").url()} 800w`,
							].join(", ")}
							sizes="(max-width: 900px) 180px, 420px"
							alt="Peter Shin"
							className="about-photo"
							loading="eager"
							decoding="async"
						/>
					</motion.div>
					<motion.div
						className="about-content"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
					>
						<h2 className="section-title">About Me</h2>
						<p className="about-text">{about.bio}</p>
						<div className="about-links">
							<a
								href="mailto:ssm.peter.shin@gmail.com"
								className="about-link"
								onClick={() =>
									window.umami && window.umami.track("Email Link Clicked")
								}
							>
								ssm.peter.shin@gmail.com
							</a>
							<a
								href="https://instagram.com/ptrshin"
								className="about-link"
								target="_blank"
								rel="noopener noreferrer"
								onClick={() =>
									window.umami && window.umami.track("Instagram Link Clicked")
								}
							>
								<FaInstagram className="ig-icon" />
								Instagram
							</a>
						</div>
					</motion.div>
				</>
			)}
		</motion.div>
	);
}
