import { ContentType, ContentsType, FieldType } from "./types";

export { ContentType, ContentsType, FieldType };

export interface FieldDefinition {
  type: FieldType;
  label?: string;
  fields?: Record<string, FieldDefinition>;
}

export interface ContentTypeDefinition {
  name: string;
  type: ContentType;
  fields: Record<string, FieldDefinition>;
}

export interface ContentsTypeDefinition {
  name: string;
  type: ContentsType;
  fields: Record<string, FieldDefinition>;
}
