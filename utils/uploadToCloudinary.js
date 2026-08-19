const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer, folder = "kadakati-school") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                format: "webp",
                transformation: [
                    {
                        width: 1200,
                        height: 675,
                        crop: "limit"
                    },
                    {
                        quality: "auto",
                        fetch_format: "auto"
                    }
                ]
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};

module.exports = uploadToCloudinary;