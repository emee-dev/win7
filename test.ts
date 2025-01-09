import { promises as fs } from "fs";
import path from "path";

const baseURL = "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com";

async function getFilesWithUrls(directory: string) {
  try {
    // Read the directory content
    const files = await fs.readdir(directory);

    // Filter for .png and .webp files
    const filteredFiles = files.filter(
      (file) => file.endsWith(".png") || file.endsWith(".webp")
    );

    // Construct URLs
    const urls = filteredFiles.map((file) => `${baseURL}/${file}`);

    // Print the URLs
    console.log(urls);
  } catch (error) {
    console.error("Error reading directory:", error);
  }
}

// Provide the path to your directory containing the files
getFilesWithUrls("./static/img");
