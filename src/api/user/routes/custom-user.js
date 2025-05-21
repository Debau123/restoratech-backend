module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/users/register-custom',
      handler: 'custom-user.register',
      config: {
        auth: false,
      },
    },
  ],
};
