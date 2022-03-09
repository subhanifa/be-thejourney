const { tb_user } = require("../../models")

const Joi = require("joi");
const encrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
    // Data from User/Client
    const input = req.body

    // Code for Validation Schema 
    const schema = Joi.object({
        fullname: Joi.string().min(5).required(),
        phone: Joi.string().min(7).required(),
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(4).required()
    });

    // Do Validation & get error object from Schema
    const { error } = schema.validate(input);

    // If error exist send Validation error message
    if ( error )
    return res.status(400).send({
        error: {
            message: error.details[0].message
        }
    });

    try {
        const userExist = await tb_user.findOne({
            where: {
                email: input.email
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });
        if (userExist) {
            return res.status(400).send({
                status: "Failed",
                message: "Email Already Registered"
            })
        }
        // Generate salt (random value) with 10 rounds
        const salt = await encrypt.genSalt(10);
        // Hashing password from request with salt
        const hashedPassword = await encrypt.hash(input.password, salt)

        const newUser = await tb_user.create({
            fullname: input.fullname,
            phone: input.phone,
            email: input.email,
            password: hashedPassword
        })


        const token = jwt.sign({ id: newUser.id, name: newUser.fullname, email: newUser.email }, process.env.ACCOUNT_TOKEN)

        const userId = ({
            id: newUser.id,
            fullname: newUser.fullname,
            email: newUser.email,
            token
        })
        // console.log(userId);

        res.status(200).send({
            message: "Success",
            userId
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            staus: "Failed",
            message: "Server Error"
        });
    }
}

exports.login = async (req, res) => {
    // Data from User/Client
    const input = req.body

    // Validation Schema
    const schema = Joi.object({
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(4).required()
    });

    // Do Validation & get error object from Schema
    const { error } = schema.validate(input);

    // If error exist send Validation error message
    if ( error )
    return res.status(400).send({
        error: {
            message: error.details[0].message
        }
    });

    try {
        const userExist = await tb_user.findOne({
            where: {
                email: input.email
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });

        if (!userExist) {
            return res.status(400).send({
                status: "Failed",
                message: "Email is not Registered"
            })
        }

        // Compare password between entered from client and from database
        const isValid = await encrypt.compare(input.password, userExist.password);

        // Check if not valid then return response with status 400 ( Bad Request )
        if (!isValid) {
            return res.status(400).send({
                status: "Failed",
                message: "Password Incorrect"
            });
        }

        const token = jwt.sign({ id: tb_user.id }, process.env.ACCOUNT_TOKEN)

        const user = {
            // id: tb_user.id,
            fullname: userExist.name,
            email: userExist.email,
            token
        }

        res.status(200).send({
            message: "Success",
            username: user.email,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            staus: "Failed",
            message: "Server Error"
        });
    }

}