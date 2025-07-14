// src/util/cognitoConfig.js - CORREGIDO para Vercel
console.log('🌐 Current hostname:', window.location.hostname);
console.log('🌐 Current protocol:', window.location.protocol);

// 🔧 DETECTAR ENTORNO automáticamente
const isDevelopment = window.location.hostname === 'localhost';
const isVercel = window.location.hostname.includes('vercel.app');

// 🚀 CONFIGURAR REDIRECT URI según entorno
let redirectUri;
let postLogoutUri;

if (isDevelopment) {
  redirectUri = "http://localhost:3000/auth/callback";
  postLogoutUri = "http://localhost:3000/";
  console.log('🏠 Entorno: DEVELOPMENT');
} else if (isVercel) {
  redirectUri = "https://front-final-nine.vercel.app/auth/callback";
  postLogoutUri = "https://front-final-nine.vercel.app/";
  console.log('🚀 Entorno: VERCEL');
} else {
  redirectUri = "https://front-final-nine.vercel.app/auth/callback";
  postLogoutUri = "https://front-final-nine.vercel.app/";
  console.log('🌐 Entorno: PRODUCTION');
}

console.log('🔗 Redirect URI configurada:', redirectUri);

// 🚀 CONFIGURACIÓN PRINCIPAL DE COGNITO
export const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_BM2KEBPZM",
  client_id: "53h6m5krqkq8phqtf63ed0otu5",
  redirect_uri: redirectUri,
  post_logout_redirect_uri: postLogoutUri,
  response_type: "code",
  scope: "openid email profile",
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: false, // Usar ID token en lugar de userinfo endpoint
};

// 🔧 DOMINIO DE COGNITO - USANDO EL CORRECTO
export const cognitoDomain = "https://us-east-1bm2kebpzm.auth.us-east-1.amazoncognito.com";
export const clientId = "53h6m5krqkq8phqtf63ed0otu5";

// 🚀 URLs DINÁMICAS según entorno
export const getCognitoUrls = () => {
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  
  return {
    login: `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${encodedRedirectUri}`,
    signup: `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${encodedRedirectUri}`,
    logout: `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(postLogoutUri)}`,
    
    // URLs para diferentes tipos de usuario con estado personalizado
    signupCustomer: `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${encodedRedirectUri}&state=role-customer`,
    signupSalonOwner: `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${encodedRedirectUri}&state=role-salon-owner`,
    signupAdmin: `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${encodedRedirectUri}&state=role-admin`,
  };
};

// 🔍 DEBUG
console.log('🔧 Cognito URLs:', getCognitoUrls());