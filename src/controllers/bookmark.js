const { tb_bookmark, tb_story, tb_user  } = require('../../models')


// exports.addsBookmark = async (req, res) => {
//     // Data from User/Client
//     const input = req.body
//     try {
//         const storyExist = await tb_bookmark.findOne({
//             where: {
//               title: input.title,
//             },
//             attributes: {
//               exclude: ["createdAt", "updatedAt"],
//             },
//         });
      
//         if (storyExist) {
//             return res.status(400).send({
//                 status: "Failed",
//                 message: "Title already Taken",
//             })
//         }

//         const { data } = req.body;
//         let newStory = await tb_story.create({
//             ...data,
//             title: input.title,
//             desc: input.desc,
//             image: req.file.filename,
//             userId: req.tb_user.id
//         })

//         newStory = JSON.parse(JSON.stringify(newStory))
//         newStory = {
//             ...newStory,
//             image: process.env.FILE_PATH + newStory.image
//         }

//         res.send({
//             id: newStory.id,
//             title: newStory.title,
//             description: newStory.desc,
//             status: "Success"
//         })

//     } catch (error) {
//         res.status(500).send({
//             status: "Failed",
//             message: "Server Error",
//         });
//     } 
// } 

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

        if (userExist && bookmarkExist) {
            return res.status(400).send({
                status: "Failed",
                message: `User id: ${userExist.id} already bookmark Story with id: ${bookmarkExist.id} `,
            })
        }

        const story = await tb_story.findOne({
            where: {
                id: input.storyId
            }
        })
        const { data } = req.body;
        let newBookmark = await tb_bookmark.create({
            ...data,
            userId: req.tb_user.id,
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

exports.deleteBookmark = async (req, res) => {
    try {
        const {id} = req.params
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