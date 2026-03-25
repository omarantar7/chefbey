import { ContentsType, FieldType } from "../index";
import type { ContentsTypeDefinition } from "../index";

const definition: ContentsTypeDefinition = {
  name: "Recipes",
  type: ContentsType.Recipes,
  fields: {
    description: { type: FieldType.Text, label: "Recipe Description" },
    image: { type: FieldType.Image, label: "Recipe Image" },
    cardImage: { type: FieldType.Image, label: "Recipe Card Image" },
    prepTime: { type: FieldType.String, label: "Preparation Time" },
    servings: { type: FieldType.String, label: "Servings" },
    calories: { type: FieldType.String, label: "Calories" },
    ingredients: {
      type: FieldType.Repeater,
      label: "Ingredients",
      fields: {
        name: { type: FieldType.String, label: "Ingredient name" },
      },
    },
    instructions: {
      type: FieldType.Repeater,
      label: "Cooking Instructions",
      fields: {
        title: { type: FieldType.String, label: "Step title" },
        description: { type: FieldType.Text, label: "Step description" },
      },
    },
  },
};

export default definition;