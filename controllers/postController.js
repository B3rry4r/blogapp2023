import postModel from "../models/post.js";

export const createPost = async (req, res) => {

    //   console.log(req.body);
    console.log(req.userId);

    const post = new postModel({ ...req.body, creator: req.userId });

    try {
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const getAllPost = async (req, res) => {
    try {
        const posts = await postModel.find().sort({ _id: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const queryForAPost = async (req, res) => {
    try {
        const posts = await postModel.find({ creator: req.body.userId });
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getASinglePost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await postModel.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateASinglePost = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const userPost = await postModel.findById(id)

        if (userPost.creator !== req.userId) {
            return res.status(409).json({ message: 'Unable to delete post that does not belong to you' });
        }
        const options = { new: true };
        const data = await postModel.findByIdAndUpdate(id, updatedData, options);
        res.status(200).json({ message: 'updated successfully', data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const userPost = await postModel.findById(id)

    if (userPost.creator !== req.userId) {
        return res.status(409).json({ message: 'Unable to delete post that does not belong to you' });
    }

    try {
        await postModel.findByIdAndDelete(id);

        res.status(200).json('POST WAS DELETED SUCCESSULLY');
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const deleteAllPost = async (req, res) => {
    const creator = req.params.id;   
    try {
        const remainingPosts = await postModel.deleteMany({creator: creator});
        res.status(200).json({message: 'Deleted Successfully', remainingPosts});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

