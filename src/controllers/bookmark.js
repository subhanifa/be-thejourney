const { tb_bookmark, tb_story, tb_user  } = require('../../models')


exports.addBookmark = async (req, res) => {
    // Data from User/Client
    const input = req.body

    try {

        const userExist = await tb_user.findOne({
            where:{
                id: req.tb_user.id
            }
        })

        const bookmarkExist = await tb_bookmark.findOne({
            where:{
                id: input.storyId
            }
        })

        if (userExist && !bookmarkExist) {
            return res.status(400).send({
                status: "Failed",
                message: `User id: ${userExist.id} already bookmark Story with id: ${bookmarkExist.id} `,
            })
        } else {
            
        }

        const story = await tb_story.findOne({
            where: {
                id: input.storyId
            }
        })
        const { data } = req.body;
        let newBookmark = await tb_bookmark.create({
            ...data,
            userId: input.userId,
            storyId: input.storyId
        })

        res.send({
            status: "Success",
            userId: newBookmark.userId,
            story: { 
                storyId: newBookmark.storyId,
                title: story.title,
                desc: story.desc, 
                image: story.image
            }
        })

    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    }
}

exports.getBookmarks = async (req, res) => {
    try {
        let allBookmarks= await tb_bookmark.findAll({
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

        res.send({
            status: "Success",
            data: { allBookmarks }
        })

    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error",
            });
    }

}

exports.getBookmark = async (req,res) => {
    try {
        const {id} = req.params
        let data = await tb_bookmark.findOne({
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
                exclude: ["createdAt", "updatedAt", "idUser"]
            }
        })

        res.send({
            status: "Success",
            message: `Showing Bookmark from id: ${id}`,
            data: {
                bookmark: data
            }
        })

    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
}

exports.deleteBookmark = async (req, res) => {
    try {
        const {id} = req.params

        // const userExist = await tb_user.findOne({
        //     where:{
        //         id: req.tb_user.id
        //     }
        // })

        // const userBookmark = await tb_bookmark.findOne({
        //     where: {
        //         id: req.tb_bookmark.userId
        //     }
        // })

        // if ( userExist == userBookmark) {
        //     return res.status(400).send({
        //         status: "Failed",
        //         message: "Beda Auth Zheyeng"
        //     })
        // }

        const bookmark = await tb_bookmark.findOne({
            where: { id }
        });

        await tb_bookmark.destroy({
            where: {
                id
            }
        });

        res.send({
            status: "Success",
            message: `Deleted Story id: ${id}`,
            bookmark: bookmark
        })

    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
}