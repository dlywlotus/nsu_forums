const isBlobUrl = (url: string) => {
  return url.startsWith("blob:");
};

export default isBlobUrl;
