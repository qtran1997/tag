import mongoose from "mongoose";

type toObjectIdFunc = (id: string) => mongoose.Types.ObjectId;

const toObjectId: toObjectIdFunc = (id) => {
  return mongoose.Types.ObjectId(id);
};

export default toObjectId;
