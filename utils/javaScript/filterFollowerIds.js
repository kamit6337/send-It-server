const filterFollowerIds = (ids, numberOfusers = 2) => {
  if (!Array.isArray(ids)) return ids;

  if (ids.length <= numberOfusers) return ids;

  return ids.slice(0, numberOfusers);
};

export default filterFollowerIds;
