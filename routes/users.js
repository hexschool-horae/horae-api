var express = require("express");
var router = express.Router();
const userController = require("../controllers/user");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");
// router.post("/sign-up", handleErrorAsync(userController.signUp));

router.post(
  "/sign-up",
  handleErrorAsync(userController.signUp),
  function (req, res, next) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'B01-1 註冊'
     */
    /**
  #swagger.parameters['parameter_name'] = {
    in: 'body',
    description: 'email and password are required.',
    schema: {
      $email: 'test@gmail.com',
      $password: '123456YY',
    }
  }
  */
    /**

  #swagger.responses[200] = {
    description: '註冊成功',
    schema: {
     success: "true",
     user: {
     token:
      "eyJhbGciOizI1NiMY4jg1NzV7TlXbbewxs4PjwAAwZM",
      },
      message: "成功",
    }
  }

  #swagger.responses[400] = {
    description: '欄位輸入錯誤，請重新輸入',
    schema: {
    "success": false,
    "message": "錯誤訊息"
    }
  }
  #swagger.responses[500] = {
    description: '系統錯誤',
    schema: {   
      "success": false,
      "message": "系統錯誤，請洽管理員"
    }
  }
*/
  }
);

router.post(
  "/login",
  handleErrorAsync(userController.login),
  function (req, res, next) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'B01-2 登入'
     */
    /**
  #swagger.parameters['parameter_name'] = {
    in: 'body',
    description: 'email and password are required.',
    schema: {
      $email: 'test@gmail.com',
      $password: '123456YY',
    }
  }
  */
    /**

  #swagger.responses[200] = {
    description: '登入成功',
    schema: {
     success: "true",
     user: {
     token:
      "eyJhbGciOizI1NiMY4jg1NzV7TlXbbewxs4PjwAAwZM",
      },
      message: "成功",
    }
  }

  #swagger.responses[400] = {
    description: '欄位輸入錯誤，請重新輸入',
    schema: {
    "success": false,
    "message": "錯誤訊息"
    }
  }
  #swagger.responses[500] = {
    description: '系統錯誤',
    schema: {   
      "success": false,
      "message": "系統錯誤，請洽管理員"
    }
  }
*/
    //next(handleErrorAsync(userController.login));
  }
);
router.get("/profile", isAuth, handleErrorAsync(userController.getProfile));
router.patch(
  "/profile",
  isAuth,
  handleErrorAsync(userController.updateProfile)
);
router.put(
  "/reset-pwd",
  isAuth,
  handleErrorAsync(userController.updatePassword)
);
router.post("/logout", isAuth, handleErrorAsync(userController.logout));
router.get("/boards", isAuth, handleErrorAsync(userController.getAllBoards));
module.exports = router;
