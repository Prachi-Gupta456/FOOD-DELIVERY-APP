import cloudinary from "../config/cloudinary.js";

const uploadOnCloudinary = async (file) => {

    const result = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream({ folder: "uploads" }, (error, uploadResult) => {

            if (error) {
                return reject(error)
            }

            resolve(uploadResult)
        })

        stream.end(file.buffer)
    })

    return result.secure_url

}

export default uploadOnCloudinary;