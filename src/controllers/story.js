const { tb_story, tb_user } = require('../../models')


exports.addStory = async (req, res) => {
    // Data from User/Client
    const input = req.body
    try {
        
        const storyExist = await tb_story.findOne({
            where: {
                title: input.title
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });

        if(storyExist) {
            return res.status(400).send({
                status: "Failed",
                message: "Title Already Taken"
            })
        }
        const { data } = req.body;
        let newStory = await tb_story.create({
            ...data,
            title: input.title,
            desc: input.desc,
            image: req.file.filename,
            idUser: req.tb_user.id
        })

        newStory = JSON.parse(JSON.stringify(newStory))
        newStory = {
            ...newStory,
            image: process.env.FILE_PATH + newStory.image
        }

        res.send({
            id: newStory.id,
            title: newStory.id,
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
                exclude: ["createdAt", "updatedAt", "idUser"]
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
            status: "Success on Getting Stories",
            data: { data }
        })

    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error",
            });
    }
}