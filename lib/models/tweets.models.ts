import mongoose from "mongoose";

const tweetsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thumbnail: {
    type: String,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweets",
  },
});

const Tweets = mongoose.models.Tweets || mongoose.model("Tweets", tweetsSchema);

export default Tweets;
