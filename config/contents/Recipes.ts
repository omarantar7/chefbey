import { ContentsType, FieldType } from "../index";
import type { ContentsTypeDefinition } from "../index";

const definition: ContentsTypeDefinition = {
  name: "Recipes",
  type: ContentsType.Recipes,
  fields: {
    description: { type: FieldType.Text, label: "Recipe Description" },
    calories: { type: FieldType.String, label: "Recipe calories" },
    image: { type: FieldType.Image, label: "Recipe Image" },
    prepTime: { type: FieldType.String, label: "Preperation Time" },
    servings: { type: FieldType.String, label: "Servings" },
    ingredients: {
      type: FieldType.Repeater,
      label: "ingredients",
      fields: {
        name: { type: FieldType.String, label: "ingredient name" },
      },
    },
  },
};

export default definition;
