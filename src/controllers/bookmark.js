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
            newBookmark,
            id: story.userId,
            title: story.title,
            desc: story.desc,
        })

    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    }
}