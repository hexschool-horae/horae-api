const handleError = (res, error) => {
  let message = "";
  if (error) {
    message = error.message;
  } else {
    message = "欄位未填寫正確或無此ID";
  }

  res.send({ status: false, message: message }).end();
};

module.exports = handleError;
