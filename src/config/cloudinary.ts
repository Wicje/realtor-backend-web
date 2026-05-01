const cloudinary = {
  uploader: {
    upload: async (_value: string) => {
      throw new Error("Cloudinary integration is not configured in this build.");
    },
  },
};

export default cloudinary;
