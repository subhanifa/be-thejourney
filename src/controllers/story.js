const { tb_story, tb_user } = require('../../models')
const fs = require('fs');
const jwt_decode = require('jwt-decode');


exports.addStory = async (req, res) => {
    // Data from User/Client
    const input = req.body
    try {

        const storyExist = await tb_story.findOne({
            where: {
              title: input.title,
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
        });
      
        if ( storyExist ) {
            return res.status(400).send({
                status: "Failed",
                message: "Title already Taken",
            })
        }

        const { data } = req.body;
        let newStory = await tb_story.create({
            ...data,
            title: input.title,
            desc: input.desc,
            image: req.file.filename,
            userId: req.tb_user.id
        })

        newStory = JSON.parse(JSON.stringify(newStory))
        newStory = {
            ...newStory,
            image: process.env.FILE_PATH + newStory.image
        }

        res.send({
            id: newStory.id,
            title: newStory.title,
            description: newStory.desc,
            status: "Success"
        })

    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    } 
} 

exports.getStories = async (req, res) => {
    try {
        let allStory = await tb_story.findAll({
            include: [
                {
                    model: tb_user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"]
                    }
                }
            ],
            attributes:  {
                exclude: [ "updatedAt", "idUser"]
            }
        });

        allStory = JSON.parse(JSON.stringify(allStory))

        data = allStory.map((item) => {
            return {
                ...item,
                image: process.env.FILE_PATH + item.image
            }
        })

        res.send({
            status: "Success",
            stories: { data }
        })

    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error",
            });
    }
}

exports.getUserStories = async (req, res) => {
    try {
        const token = req.header("Authorization")
        let decoded = jwt_decode(token)
        // const { id } = req.params
        let data = await tb_story.findAll({
            where: {
                userId: decoded.id,
            },
            include: [
                {
                model: tb_user,
                as: "user",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "password", "phone"],
                },
            }]
        })
        
        data = JSON.parse(JSON.stringify(data));
        data = data.map((item) => {
            return {
              ...item,
              image: process.env.FILE_PATH + item.image,
            };
        });

        res.send({
            status: "Success",
            user: {
                data
            }
        });

    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
}

exports.getStory = async (req, res) => {
    try {
        const {id} = req.params
        let data = await tb_story.findOne({
            where: {
                id
            },
            include: [
                {
                    model: tb_user,
                    as: "user",
                    attributes: ["fullname", "email", "createdAt", "updatedAt"]
                }
            ],
            attributes: {
                exclude: ["updatedAt", "idUser"]
            }
        })

        story = JSON.parse(JSON.stringify(data))
        story = {
            ...story,
            image: process.env.FILE_PATH + story.image
        }
        
        res.send({
            status: "Success",
            message: `Showing Story from id: ${id}`,
            story,
        })

    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
}

exports.deleteStory = async (req, res) => {
    try {
        const {id} = req.params
        const story = await tb_story.findOne({
            where: {
                id
            },
            attributes: ["image"]
        });

        let imageFile = 'uploads/' + story.image
        // Deleting File Image
        fs.unlink(imageFile, (err => {
            if(err) console.log(err)
            else console.log("\nDeleted File:" + imageFile)
        }));

        await tb_story.destroy({
            where: {
                id
            }
        });

        res.send({
            status: "Success",
            message: `Deleted Story id: ${id}`,
            story: {
                id
            }
        })

    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
}