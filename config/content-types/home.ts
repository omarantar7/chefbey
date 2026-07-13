import { ContentType, FieldType } from "../index";
import type { ContentTypeDefinition } from "../index";

const definition: ContentTypeDefinition = {
  name: "Home",
  type: ContentType.Home,
  fields: {
    heroName: { type: FieldType.String, label: "Hero ChefBey Name" },
    title: { type: FieldType.String, label: "Hero Title" },
    description: { type: FieldType.Text, label: "Hero Description" },
    bgHeroImage: { type: FieldType.Image, label: "Background Hero Image" },
    experienceNumber: { type: FieldType.String, label: "Experience Number" },
    experienceLabel: { type: FieldType.String, label: "Experience Label" },
    dishesNumber: { type: FieldType.String, label: "Dishes Number" },
    dishesLabel: { type: FieldType.String, label: "Dishes Label" },
    youtubeLink: { type: FieldType.StatString, label: "Youtube Video Id" },
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
    awardsTitle: { type: FieldType.String, label: "Awards Title" },
    awardsDescr: { type: FieldType.String, label: "Awards Description" },
    awards: {
      type: FieldType.Repeater,
      label: "Awards",
      fields: {
        image: { type: FieldType.Image, label: "Award Image" },
        title: { type: FieldType.String, label: "Award Title" },
        description: { type: FieldType.Text, label: "Award Description" },
      },
    },
    recipesTitle: { type: FieldType.String, label: "Recipes Title" },
    recipesDescr: { type: FieldType.String, label: "Recipes Description" },
    recipesBg: { type: FieldType.Image, label: "Recipes Background Image" },
    contactTitle: { type: FieldType.String, label: "Contact Title" },
    contactDescr: { type: FieldType.String, label: "Contact Description" },
    contactImage: { type: FieldType.Image, label: "Contact Us Image" },
  },
};

export default definition;
