const mapLoaderResult = (ids, results) => {
  const map = new Map(results.map((u) => [u._id.toString(), u]));
  return ids.map((id) => map.get(id.toString()));
};

export default mapLoaderResult;
