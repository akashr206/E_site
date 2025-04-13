const cloudinary = require("cloudinary");

async function uploadImages(images) {
    try {
        let uploadedImages = [];
        for (const imageData of images) {
            let uploadResponse;

            if (typeof imageData === "string") {
                if (imageData.startsWith("http")) {
                    uploadedImages.push({ url: imageData });
                    continue;
                } else {
                    uploadResponse = await cloudinary.uploader.upload(
                        imageData,
                        {
                            folder: "products",
                            transformation: [{ width: 1000, crop: "limit" }],
                        }
                    );
                }
            } else if (imageData.url) {
                uploadedImages.push(imageData);
                continue;
            } else {
                console.warn(
                    "Skipping image with unknown format:",
                    typeof imageData
                );
                continue;
            }

            if (uploadResponse) {
                uploadedImages.push({
                    url: uploadResponse.secure_url,
                    publicId: uploadResponse.public_id,
                });
            }
        }
        return uploadedImages;
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = uploadImages;
