import User from "../model/userModel.js";

//GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ["name", "email", "contact", "profilePic"];
    const updates = {};
    // Only include allowed fields in the update object
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    // Update the user with filtered fields
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ msg: "Server error while updating profile." });
  }
};

//PROFILE PHOTO UPDATE
export const updateProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.photo = req.file.path; // Cloudinary URL
    await user.save();
    res.json({ msg: "Profile photo updated!", photo: user.photo });
  } catch (err) {
    res.status(500).json({ msg: "Error uploading photo", error: err.message });
  }
};
