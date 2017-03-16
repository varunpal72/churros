module.exports = (element, method) => {
  return Promise.resolve(element + ':' + method);
};
