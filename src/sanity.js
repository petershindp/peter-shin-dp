import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
	projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
	dataset: import.meta.env.VITE_SANITY_DATASET || "production",
	apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2023-01-01",
	useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
	return builder.image(source);
}
