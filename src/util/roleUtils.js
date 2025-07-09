// src/utils/roleUtils.js - UTILIDAD PARA MANEJAR ROLES
export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  SALON_OWNER: 'SALON_OWNER', 
  ADMIN: 'ADMIN'
};

/**
 * Normalizar roles que pueden venir del backend
 */
export const normalizeRole = (role) => {
  if (!role) return ROLES.CUSTOMER;
  
  const cleanRole = role.toUpperCase().replace('ROLE_', '');
  
  switch (cleanRole) {
    case 'SALON_OWNER':
    case 'SALONOWNER':
      return ROLES.SALON_OWNER;
    case 'ADMIN':
    case 'ADMINISTRATOR':
      return ROLES.ADMIN;
    case 'CUSTOMER':
    case 'USER':
    default:
      return ROLES.CUSTOMER;
  }
};

/**
 * Verificar si el usuario puede acceder a una ruta
 */
export const canAccessRoute = (userRole, requiredRole) => {
  const normalizedUserRole = normalizeRole(userRole);
  const normalizedRequiredRole = normalizeRole(requiredRole);
  
  return normalizedUserRole === normalizedRequiredRole;
};

/**
 * Obtener la ruta de redirección según el rol
 */
export const getRedirectPath = (role) => {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case ROLES.SALON_OWNER:
      return '/salon-dashboard';
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.CUSTOMER:
    default:
      return '/';
  }
};

/**
 * Verificar si el usuario es salon owner
 */
export const isSalonOwner = (role) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === ROLES.SALON_OWNER;
};

/**
 * Verificar si el usuario es admin
 */
export const isAdmin = (role) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === ROLES.ADMIN;
};

/**
 * Verificar si el usuario es customer
 */
export const isCustomer = (role) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === ROLES.CUSTOMER;
};