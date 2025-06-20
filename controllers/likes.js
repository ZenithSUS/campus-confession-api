import { Like } from "../appwrite/likes.js";

export class LikeController extends Like {
  // create like
  async useCreateLike(req, res) {
    try {
      const data = req.body;
      await this.create(data);
      return res.status(201).json({ message: "Like created successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  // get all likes
  async useGetAllLikes(req, res) {
    try {
      const allLikes = await this.getLikes();
      return res.status(200).json(allLikes);
    } catch (error) {
      console.log(error);
    }
  }

  // get like by id
  async useGetLikeById(req, res) {
    try {
      const { confessionId, commentId } = req.body;
      const like = await this.getLikeById(confessionId, commentId);
      return res.status(200).json(like);
    } catch (error) {
      console.log(error);
    }
  }

  // delete like
  async useDeleteLike(req, res) {
    try {
      const id = req.params.id;
      await this.delete(id);
      return res.status(201).json({ message: "Like deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  // update like
  async useUpdateLike(req, res) {
    try {
      const id = req.params.id;
      await this.update(id);
      return res.status(201).json({ message: "Like updated successfully" });
    } catch (error) {
      console.log(error);
    }
  }
}
