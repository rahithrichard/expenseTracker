export function handleUpdate(data: unknown) {
  localStorage.setItem('loginStore', JSON.stringify(data));
}

export function getSavedData() {
  const savedData = localStorage.getItem('loginStore');

  if (!savedData) return null;

  try {
    return JSON.parse(savedData) as unknown;
  } catch {
    return null;
  }
}

export function handleLogout() {
  localStorage.removeItem('loginStore');
}
