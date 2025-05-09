import sanityClient from "@sanity/client";
import { SANITY_PROJECT_ID } from "./Constants";

export default sanityClient({
	projectId: SANITY_PROJECT_ID, // Replace with your actual Sanity project ID
	dataset: "production",
	useCdn: true,
});
