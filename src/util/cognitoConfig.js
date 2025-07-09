// src/util/cognitoConfig.js - Configuración Corregida
export const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_BM2KEBPZM",
  client_id: "53h6m5krqkq8phqtf63ed0otu5",
  redirect_uri: "http://localhost:3000/auth/callback",
  post_logout_redirect_uri: "http://localhost:3000/",
  response_type: "code",
  scope: "openid email profile",
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
};

// ⚠️ IMPORTANTE: Necesitas el dominio de Hosted UI, no el endpoint del servicio
// Debes configurar esto con tu dominio real de Cognito Hosted UI
// Por defecto, AWS genera algo como: https://[user-pool-domain].auth.[region].amazoncognito.com
// O si tienes un dominio personalizado: https://tu-dominio-personalizado.com

// 🔧 CONFIGURACIÓN TEMPORAL - REEMPLAZA CON TU DOMINIO REAL
// Opción 1: Dominio generado por AWS (formato estándar)
export const cognitoDomain = "https://us-east-1bm2kebpzm.auth.us-east-1.amazoncognito.com";

// Opción 2: Si tienes un dominio personalizado configurado
// export const cognitoDomain = "https://tu-dominio-personalizado.com";

export const clientId = "53h6m5krqkq8phqtf63ed0otu5";

// URLs para diferentes acciones de Cognito
export const getCognitoUrls = () => {
  const redirectUri = encodeURIComponent("http://localhost:3000/auth/callback");
  
  return {
    login: `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${redirectUri}`,
    signup: `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${redirectUri}`,
    logout: `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent("http://localhost:3000/")}`,
    
    // URLs para diferentes tipos de usuario con estado personalizado
    signupCustomer: `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${redirectUri}&state=role-customer`,
    signupSalonOwner: `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${redirectUri}&state=role-salon-owner`,
    signupAdmin: `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${redirectUri}&state=role-admin`,
  };
};

// ==========================================
// 🚨 PASOS PARA ENCONTRAR TU DOMINIO REAL:
// ==========================================
/*
1. Ve a la consola de AWS Cognito
2. Selecciona tu User Pool (us-east-1_BM2KEBPZM)
3. Ve a "App integration" > "Domain"
4. Si ves un dominio configurado, úsalo
5. Si no hay dominio, necesitas crear uno:
   - Clic en "Create custom domain" o "Create Cognito domain"
   - Elige un nombre único (ej: salon-beauty-app)
   - El dominio será: https://salon-beauty-app.auth.us-east-1.amazoncognito.com

EJEMPLO DE LO QUE DEBERÍAS VER:
- Cognito domain: salon-beauty-app.auth.us-east-1.amazoncognito.com
- Custom domain: tu-dominio.com (si configuraste uno)

UNA VEZ QUE TENGAS EL DOMINIO, REEMPLAZA LA LÍNEA:
export const cognitoDomain = "https://TU-DOMINIO-REAL-AQUI";
*/