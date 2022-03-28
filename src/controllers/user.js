const { tb_user } = require('../../models')
const jwt_decode = require('jwt-decode');
// const fs = require('fs')
// const uploadServer = "http://localhost:5000/uploads/";
const cloudinary = require("../utils/cloudinary");


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

// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await tb_user.update(req.body, {
//       where: {
//         id,
//       },
//     });

//     res.send({
//       status: "Success",
//       message: `Update user id: ${id} finished`,
//       data: req.body,
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
        fullname: data.fullname,
        image: process.env.USER_PATH + "user-journey/" + data.image,
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

exports.updateUserImage = async (req, res) => {
  try {
    const token = req.header("Authorization")
    let decoded = jwt_decode(token)

    const oldFile = await tb_user.findOne({
      where: {
        id: decoded.id
      }
    })

    // let imageFile = "uploads/" + oldFile.image
    if ( oldFile.image !== "default.png" ) {
      cloudinary.uploader.destroy(oldData.image, function (result) {
        console.log(result);
      });
    }

    const result = await cloudinary.uploader.upload(request.file.path, {
      folder: "user-journey",
      use_filename: true,
      unique_filename: true,
    });

    const data = await tb_user.update(
      {
        image: result.public_id
      },
      {
        where: {
          id: decoded.id
        }
      }
    )

    res.status(200).send({
      status: "Success",
      message: "User Image Updated",
      data
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: "Failed",
      message: "Server Error"
    })
  }
}