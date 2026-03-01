import { ContentsType, FieldType } from "../index";
import type { ContentsTypeDefinition } from "../index";

const definition: ContentsTypeDefinition = {
  name: "Recipes",
  type: ContentsType.Recipes,
  fields: {
    title: { type: FieldType.String, label: "Recipe Title" },
    description: { type: FieldType.Text, label: "Recipe Description" },
    image: { type: FieldType.Image, label: "Recipe Image" },
  },
};

export default definition;
