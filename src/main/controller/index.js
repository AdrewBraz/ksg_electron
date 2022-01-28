import model from '../model';

const dsController = async (ds, reply) => {
  const coll = await model.aggregate([
    { $match: { MKB_1: { $regex: `^${ds}`, $options: 'i' }, GROUP_NUM: { $in: [27, 76, 77, 78, 79, 80, 81, 82, 83, 84, 96, 97, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257] } } },
    {
      $lookup: {
        from: 'ksg_ratio22',
        localField: 'KSG',
        foreignField: 'KSG',
        as: 'ratio',
      },
    },
    {
      $unwind: {
        path: '$ratio',
      },
    },
    {
      $set: { RATIO: '$ratio.K' },
    },
    {
      $project: {
        _id: 0, __v: 0, ratio: 0,
      },
    },
  ]);
  reply.send(coll);
};

const uslController = async (usl, reply) => {
  const patternMatch = usl.match(/(A\d{2}(\.)?[0-9\.]*)/gi);
  let regexObj;
  if (patternMatch) {
    regexObj = { COD_USL: { $regex: `^${usl}`, $options: 'i' } };
  } else {
    const regex = new RegExp(/\b[А-Яа-я]?/);
    regexObj = { USL_NAME: { $regex: `$${usl}`, $options: 'ig' } };
  }
  const coll = await model.aggregate([
    { $match: { ...regexObj, GROUP_NUM: { $in: [27, 76, 77, 78, 79, 80, 81, 82, 83, 84, 96, 97, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257] } } },
    {
      $lookup: {
        from: 'ksg_ratio22',
        localField: 'KSG',
        foreignField: 'KSG',
        as: 'ratio',
      },
    },
    {
      $unwind: {
        path: '$ratio',
      },
    },
    {
      $set: { RATIO: '$ratio.K' },
    },
    {
      $project: {
        _id: 0, __v: 0, ratio: 0,
      },
    },
  ]);
  reply.send(coll);
};

const listDsController = async (list) => {
  const coll = await model.aggregate([
    {
      $match: {
        MKB_1: { $in: list },
        GROUP_NUM: { $in: [27, 76, 77, 78, 79, 80, 81, 82, 83, 84, 96, 97, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257] },
      },
    },
    {
      $lookup: {
        from: 'ksg_ratio22',
        localField: 'KSG',
        foreignField: 'KSG',
        as: 'ratio',
      },
    },
    {
      $unwind: {
        path: '$ratio',
      },
    },
    {
      $set: { RATIO: '$ratio.K' },
    },
    {
      $project: {
        _id: 0, __v: 0, ratio: 0,
      },
    },
  ]);
  return coll;
};

const listUslController = async (list) => {
  const coll = await model.aggregate([
    {
      $match: {
        COD_USL: { $in: list },
        GROUP_NUM: { $in: [27, 76, 77, 78, 79, 80, 81, 82, 83, 84, 96, 97, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257] },
      },
    },
    {
      $lookup: {
        from: 'ksg_ratio22',
        localField: 'KSG',
        foreignField: 'KSG',
        as: 'ratio',
      },
    },
    {
      $unwind: {
        path: '$ratio',
      },
    },
    {
      $set: { RATIO: '$ratio.K' },
    },
    {
      $project: {
        _id: 0, __v: 0, ratio: 0,
      },
    },
  ]);
  return coll;
};

const allUsl = async () => {
  const coll = await model.find({ GROUP_NUM: { $in: [27, 76, 77, 78, 79, 80, 81, 82, 83, 84, 96, 97, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257] } }).distinct('COD_USL');
  return coll.filter((item) => !!item);
};

export {
  dsController, uslController, listDsController, listUslController, allUsl,
};
