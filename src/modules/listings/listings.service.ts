import { prisma } from "../../config/db";
import cloudinary from "../config/cloudinary";

interface CreatePropertyInput {
  title: string;
  description: string;
  type: any;
  size: string;
  furnished: boolean;
  price: number;
  priceMode: any;
  state: string;
  city: string;
  street: string;
  images: string[];
}

for (const file of files) {
      const uploaded = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
      );

      imageUrls.push(uploaded.secure_url);
    }

    const property = await Property.create({
      ...req.body,
      images: imageUrls,
      status: "draft",
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: "Error creating property" });
  }
};

export const getMyProperties = async (realtorId: string) => {
  return prisma.property.findMany({
    where: { realtorId },
    orderBy: { createdAt: "desc" },
  });
};

export const getPropertyById = async (id: string) => {
  return prisma.property.findUnique({
    where: { id },
  });
};

