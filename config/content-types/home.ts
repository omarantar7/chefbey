import { ContentType, FieldType } from "../index";
import type { ContentTypeDefinition } from "../index";

const definition: ContentTypeDefinition = {
  name: "Home",
  type: ContentType.Home,
  fields: {
    title: { type: FieldType.String, label: "Hero Title" },
    description: { type: FieldType.Text, label: "Hero Description" },
    bgHeroImage: { type: FieldType.Image, label: "Background Hero Image" },
    experienceNumber: { type: FieldType.String, label: "Experience Number" },
    experienceLabel: { type: FieldType.String, label: "Experience Label" },
    dishesNumber: { type: FieldType.String, label: "Dishes Number" },
    dishesLabel: { type: FieldType.String, label: "Dishes Label" },
    heroImages: { type: FieldType.Gallery, label: "Hero Images" },
    servicesTitle: { type: FieldType.String, label: "Services Title" },
    servicesDescr: { type: FieldType.String, label: "Services Description" },
    servicesSubDescr: {
      type: FieldType.Text,
      label: "Services Sub-Description",
    },
    servicesBg: { type: FieldType.Image, label: "Services background Image" },
    services: {
      type: FieldType.Repeater,
      label: "Services",
      fields: {
        image: { type: FieldType.Image, label: "Service Image" },
        title: { type: FieldType.String, label: "Service Title" },
        description: { type: FieldType.Text, label: "Service Description" },
      },
    },
  },
};

export default definition;
