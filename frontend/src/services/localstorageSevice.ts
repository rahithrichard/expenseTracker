export function handleUpdate(data:any) {
  localStorage.setItem('loginStore', JSON.stringify(data));
}

export function getSavedData() {
  const savedData = localStorage.getItem('loginStore');

  return savedData ? JSON.parse(savedData) : null;
}

export function handleLogout() {
  localStorage.removeItem('loginStore');
}
