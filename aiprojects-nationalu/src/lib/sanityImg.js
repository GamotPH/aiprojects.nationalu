import imageUrlBuilder from "@sanity/image-url";
import { sanity } from "./sanity";
const builder = imageUrlBuilder(sanity);
export const urlFor = (source) => builder.image(source);
