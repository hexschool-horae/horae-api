const handleSuccess = (res, message, data) => {
  res.send({ status: "true", message: message, data }).end();
};

module.exports = handleSuccess;
