import React, { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { motion } from "framer-motion";
import "../styles/About.css";
import { SANITY_PROJECT_ID, SANITY_DATASET_NAME } from "../Constants";
import { FaInstagram } from "react-icons/fa";

const sanityClient = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET_NAME,
	apiVersion: "2023-01-01",
	useCdn: true,
});
const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
	return builder.image(source);
}

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
							src={urlFor(about.photo).width(400).height(400).fit("crop").url()}
							alt="Peter Shin"
							className="about-photo"
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
								href="mailto:petershin.dp@gmail.com"
								className="about-link"
								target="_blank"
								rel="noopener noreferrer"
							>
								ssm.peter.shin@gmail.com
							</a>
							<a
								href="https://instagram.com/ptrshin"
								className="about-link"
								target="_blank"
								rel="noopener noreferrer"
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
