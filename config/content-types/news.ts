import { ContentType, FieldType } from "../index";
import type { ContentTypeDefinition } from "../index";

const definition: ContentTypeDefinition = {
  name: "news",
  type: ContentType.news,
  fields: {
    title: { type: FieldType.String, label: "Hero Title" },
    description: { type: FieldType.Text, label: "Hero Description" },
    bgHeroImage: { type: FieldType.Image, label: "Background Hero Image" },
  },
};

export default definition;
