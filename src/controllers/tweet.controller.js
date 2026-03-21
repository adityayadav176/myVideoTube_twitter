import mongoose, { isValidObjectId, mongo } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Tweet not be empty")
    }

    const newTweet = await Tweet.create({
        owner: req.user._id,
        content
    })

    if (!newTweet) {
        throw new ApiError(404, "Tweet not found!")
    }

    res
        .status(201)
        .json(new ApiResponse(201, newTweet, "Tweet created successfully"))

})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { limit, page } = req.query;

    // 1. Validate userId
    if (!userId || !mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    // 2. Pagination setup
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const skip = (pageNumber - 1) * limitNumber;

    // 3. Count total tweets
    const totalTweets = await Tweet.countDocuments({
        owner: userId
    });

    // 4. Fetch tweets
    const tweets = await Tweet.find({ owner: userId })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    // 5. Handle empty result
    if (tweets.length === 0) {
        throw new ApiError(404, "No tweets found");
    }

    // 6. Response
    return res.status(200).json(
        new ApiResponse(200, {
            tweets,
            totalTweets,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalTweets / limitNumber)
        }, "Fetched tweets successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { tweetId } = req.params

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(404, "Invalid TweetId")
    }

    if (!content) {
        throw new ApiError(400, "Tweet not be empty")
    }

    const newTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content,
                owner: req.user._id
            }
        },
        {
            new: true
        }
    )

    if (!newTweet) {
        throw new ApiError(404, "Tweet not found!")
    }

    res.
        status(200)
        .json(
            new ApiResponse(200, newTweet, "Tweet updated successfully")
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(404, "Invalid TweetId")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if (!deletedTweet) {
        throw new ApiError(400, "Tweet not found!")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Tweet deleted successfully")
        )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
