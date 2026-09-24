type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T extends { id: string | number }> = {
  data: T[];
  columns: Column<T>[];
  onDelete?: (id: T["id"]) => void;
  onEdit?: (row: T) => void;
};

export type { Column, TableProps };