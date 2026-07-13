import { ContentsType, FieldType } from "../index";
import type { ContentsTypeDefinition } from "../index";

const definition: ContentsTypeDefinition = {
  name: "news",
  type: ContentsType.news,
  fields: {
    description: { type: FieldType.Text, label: "Description" },
    image: { type: FieldType.Image, label: "Image" },
    isVideo: { type: FieldType.Boolean, label: "Is Video" },
    youtubeUrl: { type: FieldType.StatString, label: "Youtube Video Url Id" },
    date: { type: FieldType.String, label: "News Date" },
  },
};

export default definition;
