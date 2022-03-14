const { tb_bookmark, tb_story, tb_user  } = require('../../models')
const jwt_decode = require('jwt-decode');


exports.addBookmark = async (req, res) => {

    try {
        // const token = req.header("Authorization")
        // let decoded = jwt_decode(token)
        console.log(req.tb_user)
        console.log(req.body)

        const bookmarkExist = await tb_bookmark.findOne({
            where:{
                userId: req.tb_user.id,
                storyId: req.body.storyId
            }
        })
        if ( bookmarkExist ) {
            await tb_bookmark.destroy({
                where: {
                    userId: req.tb_user.id,
                    storyId: req.body.storyId
                }
            })
            res.send({
                status: "Success",
                message: "Deleted Bookmark",
            })
        } else {
            await tb_bookmark.create({
                userId: req.tb_user.id,
                storyId: req.body.storyId
            })
            res.send({
                status: "Success",
                message: "Added Bookmark",
            })
        }

        


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

exports.getUserBookmarks = async (req, res) => {
    try {
        const token = req.header("Authorization")
        let decoded = jwt_decode(token)

        let data = await tb_bookmark.findAll({
            where: {
                userId: decoded.id,
            },
            include: [
                {
                    model: tb_story,
                    as: "story",
                    include: [
                        {
                            model: tb_user,
                            as: "user",
                            attributes: {
                                exclude: [ "createdAt", "updatedAt", "password", "image", "address"]
                        }},
                    ],
                    attributes:{
                        exclude: ["userId"] 
                    }
                }
            ],
            attributes:{
                exclude: [ "createdAt", "updatedAt" ]
            }
        })

        res.send({
            status: "Success",
            user: {
                data
            },
        });

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