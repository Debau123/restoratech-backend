module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/users/register-custom',
        handler: 'custom.registerCustom',
        config: {
          auth: false,  // Puedes cambiar a true si quieres protección con JWT del admin
        },
      },
    ],
  };
  