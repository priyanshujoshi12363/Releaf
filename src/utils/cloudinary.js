import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configuration
cloudinary.config({ 
    cloud_name: 'dci4jgz7e', 
    api_key: 655753366325418, 
    api_secret:"qTaXBlrgaJhGvlTxSk6kQMSEgwo"
});

const uploadOnCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                ...options
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export { uploadOnCloudinary, cloudinary };