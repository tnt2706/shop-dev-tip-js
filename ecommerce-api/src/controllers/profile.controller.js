const {  SuccessResponse } = require('../core/success.response')

const profiles = [
  {
    usr_id: 1,
    usr_name: 'CR7',
    usr_avatar: 'image.com/user/1',
  },
  {
    usr_id: 2,
    usr_name: 'Messi',
    usr_avatar: 'image.com/user/2',
  },
  {
    usr_id: 3,
    usr_name: 'Benzema',
    usr_avatar: 'image.com/user/3',
  },
];

class ProfileController {
  // admin
  profiles = (req, res, next) => {
    new SuccessResponse({
      message: "View all profile",
      metadata: profiles
    }).send(res)
  };

  profile = async (req, res, next) => {
    new SuccessResponse({
      message: "View profile",
      metadata: {
        usr_id: 2,
        usr_name: 'Messi',
        usr_avatar: 'image.com/user/2',
      },
    }).send(res)
  };

}

module.exports = new ProfileController();
