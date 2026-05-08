export function detectNameColumn(columns: string[]) {
  const possibleFields = [
    "name",
    "names",
    "full name",
    "participant name",
    "firstname",
    "first name",
    "student name",
  ];

  for (const col of columns) {
    const normalized = col.trim().toLowerCase();

    if (possibleFields.includes(normalized)) {
      return col;
    }
  }

  return null;
}