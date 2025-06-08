import { Like } from "../appwrite/likes.js";

export class LikeController extends Like {
  
  // create like
  async useCreateLike(data) {
    try {
      await this.create(data);
      return res.status(201).json({ message: "Like created successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  // get all likes
  async useGetAllLikes() {
    try {
      const allLikes = await this.getLikes();
      return res.status(200).json(allLikes);
    } catch (error) {
      console.log(error);
    }
  }

  // get like by id
  async useGetLikeById(id) {
    try {
      const like = await this.getLikeById(id);
      return res.status(200).json(like);
    } catch (error) {
      console.log(error);
    }
  }

  // delete like
  async useDeleteLike(id) {
    try {
      await this.delete(id);
      return res.status(201).json({ message: "Like deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  // update like
  async useUpdateLike(id) {
    try {
      await this.update(id);
      return res.status(201).json({ message: "Like updated successfully"});
    } catch (error) {
      console.log(error);
    }
  }
}
