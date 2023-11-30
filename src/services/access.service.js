'user strict';

async function signUp({ name, email, password }) {
  try {
    return {
      code: 'xxx',
      message: 'Sign up user success',
      status: 'success',
    };
  } catch (error) {
    return { code: 'xxx', message: error.message, status: 'error' };
  }
}

module.exports = {
  signUp,
};
