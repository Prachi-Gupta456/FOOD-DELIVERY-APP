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
    
    // {
    //     public_id: result.public_id,
    //     secure_url: result.secure_url,
    //     resource_type: result.resource_type,
    //     format: result.format,
    //     original_name: file.originalname
    // }

}

export default uploadOnCloudinary;