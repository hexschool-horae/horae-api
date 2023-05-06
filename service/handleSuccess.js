const handleSuccess = (res, message, data) => {
  res.send({ success: "true", message: message, data }).end();
};

module.exports = handleSuccess;
