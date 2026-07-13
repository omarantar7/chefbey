import { ContentType, FieldType } from "../index";
import type { ContentTypeDefinition } from "../index";

const definition: ContentTypeDefinition = {
  name: "contactUs",
  type: ContentType.ContactUs,
  fields: {
    title: { type: FieldType.String, label: "Hero Title" },
    description: { type: FieldType.Text, label: "Hero Description" },
    bgHeroImage: { type: FieldType.Image, label: "Background Hero Image" },
    subTitle: { type: FieldType.String, label: "Title 2" },
    subDescription: { type: FieldType.Text, label: "Description 2" },
  },
};

export default definition;
