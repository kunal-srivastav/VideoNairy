const subscriptionModel = require("../models/subscriptionModel");

module.exports.getAllSubscribedChannel = async (req, res) => {
  try {
    const subscribedChannels = await subscriptionModel.aggregate([
      {
        $match: {
          subscriber: req.user._id
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channelInfo",
          pipeline: [
            {
              $project: {
                avatar: 1,
                userName: 1,
                fullName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$channelInfo" },
      {
        $lookup: {
          from: "subscriptions",
          localField: "channel",
          foreignField: "channel",
          as: "channelSubscribers"
        }
      },
      {
        $addFields: {
          subscriberCount: { $size: "$channelSubscribers" },
          isSubscribed: true
        }
      },
      {
        $project: {
          _id: 0,
          channel: {
            _id: "$channelInfo._id",
            avatar: "$channelInfo.avatar",
            userName: "$channelInfo.userName",
            fullName: "$channelInfo.fullName",
            subscriberCount: "$subscriberCount",
            isSubscribed: "$isSubscribed"
          }
        }
      }
    ]);

    if (!subscribedChannels.length) {
      return res.status(200).json({ message: "No subscribed channels found" });
    }

    return res.status(200).json(subscribedChannels);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.toggleSubscription = async (req, res) => {
    try {
        const { channelId } = req.params;
        if(!channelId) return res.status(400).json("Invalid channel ID");
        const subscriberExists = await subscriptionModel.findOne({subscriber: req.user._id, channel: channelId});
        if(subscriberExists) {
            await subscriptionModel.findByIdAndDelete(subscriberExists._id);
            const totalSubscribers = await subscriptionModel.countDocuments({channel: channelId});
            return res
            .status(200)
            .json({
                message: "Unsubscribed channel",
                isSubscribed: false,
                totalSubscribers,
                channelId
            })
        };
        await subscriptionModel.create({subscriber: req.user._id, channel: channelId});
        const totalSubscribers = await subscriptionModel.countDocuments({channel: channelId})
        return res
        .status(200)
        .json({
            message: "Channel subscribed",
            isSubscribed: true,
            totalSubscribers,
            channelId
        });
    } catch (error) {
        return res.status(500).json(`Internal server error ${error.message}`);
    }
};
