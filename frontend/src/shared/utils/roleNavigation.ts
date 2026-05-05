function roleNavigation(role: string) {
  let path = '/';
  switch (role) {
    case 'ADMIN':
      path = '/dashboard';
      break;
    default:
      path = '/inicio';
      break;
  }

  return path;
}

export default roleNavigation;
