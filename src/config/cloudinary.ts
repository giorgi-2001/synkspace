import {Cloudinary} from "@cloudinary/url-gen"

// Create a Cloudinary instance and set your cloud name.
const cld = new Cloudinary({
    cloud: {
        cloudName: 'dbyooxafd'
    }
})

export default cld