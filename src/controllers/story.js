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
            price: input.price,
            image: req.file.filename,
            idUser: req.tb_user.id
        })

        newStory = JSON.parse(JSON.stringify(newStory))
        newStory = {
            ...newStory,
            image: process.env.FILE_PATH + newStory.image
        }

        res.send({
            status: "Success",
            data: { newStory }
        })

    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    }
}