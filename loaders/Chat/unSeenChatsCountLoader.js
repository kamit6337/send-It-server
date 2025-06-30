import DataLoader from "dataloader";
import unSeenChatsCountFn from "./unSeenChatsCountFn.js";

const unSeenChatsCountLoader = () =>
  new DataLoader(async (ids) => {
    // ids = [{roomId, userId}, {roomId, userId}]

    const promises = await Promise.all(
      ids.map((obj) => unSeenChatsCountFn(obj.roomId, obj.userId))
    );

    const map = new Map(
      promises.map((promise) => [
        `${promise.roomId.toString()}_${promise.userId.toString()}`,
        promise.count,
      ])
    );

    return ids.map((obj) =>
      map.get(`${obj.roomId.toString()}_${obj.userId.toString()}`)
    );
  });

export default unSeenChatsCountLoader;
