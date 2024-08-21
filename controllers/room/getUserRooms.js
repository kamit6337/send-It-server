import Room from "../../models/RoomModel.js";
import Chat from "../../models/ChatModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import ObjectID from "../../utils/ObjectID.js";

const getUserRooms = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const rooms = await Room.find({
    users: { $in: userId },
  })
    .populate({
      path: "users",
    })
    .lean();

  const roomsId = rooms.map((room) => ObjectID(room._id));

  // Aggregate to get the 50 most recent chats for each room, then merge them into one array
  const chats = await Chat.aggregate([
    {
      $match: {
        room: { $in: roomsId },
      },
    },
    {
      $sort: { createdAt: -1 }, // Sort by createdAt in descending order
    },
    {
      $group: {
        _id: "$room", // Group by room ID
        chats: { $push: "$$ROOT" }, // Push all the chat documents into the 'chats' array
      },
    },
    {
      $project: {
        chats: { $slice: ["$chats", 50] }, // Limit to the 50 most recent chats per room
      },
    },
    {
      $unwind: "$chats", // Unwind the 'chats' array into individual documents
    },
    {
      $replaceRoot: { newRoot: "$chats" }, // Replace the root with each chat document
    },
  ]);

  // Using aggregation pipeline to find rooms and populate users
  // const rooms = await Room.aggregate([
  //   {
  //     $match: {
  //       users: ObjectID(userId), // Match rooms where the users array contains the userId
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "chats",
  //       let: { roomId: "$_id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $and: [
  //                 { $eq: ["$room", "$$roomId"] },
  //                 { $ne: ["$message", ""] }, // Ensure the message is not empty
  //               ],
  //             },
  //           },
  //         },
  //         {
  //           $sort: { createdAt: -1 }, // Sort chats by createdAt to get the latest one
  //         },
  //         {
  //           $limit: 1, // Only take the latest chat message
  //         },
  //       ],
  //       as: "latestChat",
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: "$latestChat",
  //       preserveNullAndEmptyArrays: true, // To include rooms with no valid chats
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users", // Assuming "users" is the collection name for users
  //       localField: "users",
  //       foreignField: "_id",
  //       as: "users",
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       createdAt: 1, // Include other fields as necessary
  //       updatedAt: 1,
  //       "users._id": 1,
  //       "users.name": 1,
  //       "users.username": 1,
  //       "users.email": 1,
  //       "users.photo": 1,
  //       "users.bio": 1,
  //       "users.location": 1,
  //       "users.website": 1,
  //       "latestChat._id": 1,
  //       "latestChat.message": 1,
  //       "latestChat.createdAt": 1,
  //     },
  //   },
  // ]);

  res.json({
    message: "user rooms",
    rooms,
    chats,
  });
});

export default getUserRooms;
