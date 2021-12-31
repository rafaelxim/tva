export interface Column {
  id: "id" | "empresa" | "status" | "acoes";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
