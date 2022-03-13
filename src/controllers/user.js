const { tb_user } = require('../../models')
const jwt_decode = require('jwt-decode');

exports.addUsers = async (req, res) => {
    try {
      await tb_user.create(req.body);
      res.send({
        status: "Success",
        message: "Add user Success",
      });

    } catch (error) {
      console.log(error);
      res.send({
        status: "Failed",
        message: "Server Error",
      });
    }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await tb_user.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

// exports.getUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const data = await tb_user.findOne({
//       where: {
//         id: id,
//       },
//       attributes: {
//         exclude: ["password", "createdAt", "updatedAt"],
//       },
//     });

//     res.send({
//       status: "Success",
//       data: {
//         email: data.email,
//         fullname: data.fullname
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.send({
//       status: "Failed",
//       message: "Server Error",
//     });
//   }
// };

exports.getUser = async (req, res) => {
  try {
    const token = req.header("Authorization")
    let decoded = jwt_decode(token)

    const data = await tb_user.findOne({
      where: {
        id: decoded.id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success",
      data: {
        email: data.email,
        fullname: data.fullname
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    await tb_user.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: "Success",
      message: `Update user id: ${id} finished`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await tb_user.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "Success",
      message: `Delete user id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};