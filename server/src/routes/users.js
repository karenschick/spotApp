import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models";
import { requireAuth } from "../middleware";

const router = express.Router();
// GET /users/search - search for users based on zip code, pet breed, username, pet size
router.get("/search", async (req, res) => {
  try {
    const { zipcode, breed, username, size } = req.query;
    console.log("Query Parameters", { zipcode, breed, username, size });

    if (!zipcode && !breed && !username && !size) {
      return res
        .status(400)
        .json({ error: "At least one search parameter is required" });
    }

    const query = {
      $or: [
        { zipcode },
        { username: { $regex: new RegExp(`^${username}$`, "i") } },
        { "dog.size": { $regex: new RegExp(`^${size}$`, "i") } },
      ],
    };

    if (breed) {
      query.$or.push({ "dog.breed": { $regex: new RegExp(breed, "i") } });
    }

    const users = await User.find(query);

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /users/:username - get user details including posts
// PUT /users/:username - update user details
router
  .route("/:username")
  .get(async (req, res) => {
    try {
      const { username } = req.params;
      const populateQuery = {
        path: "posts",
        populate: { path: "author", select: ["username", "profile_image"] },
      };
      const user = await User.findOne({ username }).populate(populateQuery);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user.toJSON());
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .put(requireAuth, async (req, res) => {
    try {
      const { password, currentPassword, confirmPassword, ...userData } =
        req.body;
      const { username } = req.params;
      let user;

      if (password) {
        if (
          password.length < 8 ||
          password.length > 20 ||
          confirmPassword.length < 8 ||
          confirmPassword.length > 20 ||
          password !== confirmPassword
        ) {
          return res.status(422).json({
            error:
              "Password must be 8-20 characters and match the confirmation",
          });
        }

        user = await User.findOne({ username });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const passwordCorrect = await bcrypt.compare(
          currentPassword,
          user.passwordHash
        );
        if (!passwordCorrect) {
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.passwordHash = hashedPassword;

        await user.save();
      } else {
        user = await User.findOneAndUpdate(
          { username },
          { $set: { ...userData } },
          { new: true }
        );
      }

      res.status(200).json(user.toJSON());
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

//PUT /users/:username/avatar - update user avatar
router.put("/:username/avatar", requireAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const { profile_image } = req.body;

    if (req.user.username.toLowerCase() !== username.toLowerCase()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profile_image = profile_image;

    await user.save();
    res.json(user.toJSON());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//PUT /users/:username/dog/images - update dog images
router.put("/:username/dog/images", requireAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const { imgUrls } = req.body;

    if (req.user.username.toLowerCase() !== username.toLowerCase()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.dog.images = imgUrls;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
