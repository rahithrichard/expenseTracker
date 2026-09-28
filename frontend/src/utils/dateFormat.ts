function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US");
}


export default formatDate;