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
 
      #swagger.parameters['parameter_name'] = {
        in: 'body',
        description: 'email and password are required.',
        schema: {
          $email: 'test@gmail.com',
          $password: '123456YY',
        }
      }

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

      #swagger.parameters['parameter_name'] = {
        in: 'body',
        description: 'email and password are required.',
        schema: {
          $email: 'testmm@gmail.com',
          $password: '1qaz2wsx',
        }
      }
      

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
  }
);

router.post(
  "/logout",
  isAuth,
  handleErrorAsync(userController.logout),
  function (req, res, next) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'B01-6	登出'
     * #swagger.security=[{"Bearer": []}]
  

      #swagger.responses[200] = {
      description: '成功',
      schema: {
                "success": "true",
                "message": "您已登出系統"
            }
      }
      #swagger.responses[401] = {
        description: '身分驗證不通過',
        schema: {
        "success": false,
        "message": "錯誤訊息"
        }
      }

      #swagger.responses[400] = {
          description: '使用者資料不存在',
          schema: {
          "success": false,
          "message": "使用者資料不存在"
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

router.patch(
  "/profile",
  isAuth,
  handleErrorAsync(userController.updateProfile),
  function (req, res, next) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'B01-7 更新個人資料'
     * #swagger.security=[{"Bearer": []}]
      #swagger.parameters['parameter_name'] = {
        in: 'body',
        description: 'B01-7 更新個人資料',
        schema: {
          "name":"修改過name8"
        }
      }

      #swagger.responses[200] = {
        description: '成功',
        schema: {
          "success": "true",
          "message": "使用者資料更新成功"
        }
      }
      
      #swagger.responses[401] = {
        description: '身分驗證不通過',
        schema: {
        "success": false,
        "message": "錯誤訊息"
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

router.get(
  "/profile",
  isAuth,
  handleErrorAsync(userController.getProfile),
  function (req, res, next) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'B01-8 取得個人資料'
     * #swagger.security = [{"Bearer":[]}]
 
      #swagger.responses[200] = {
        description: '成功',
        schema: {
          "success": "true",
          "message": "成功",
          "data": {
            "_id": "645c605b54128783e9e56ae5",
            "name": "testmm",
            "email": "testmm@gmail.com"
          }
        }
      }
      #swagger.responses[401] = {
        description: '身分驗證不通過',
        schema: {
        "success": false,
        "message": "錯誤訊息"
        }
      }

      #swagger.responses[400] = {
        description: '使用者資料不存在',
        schema: {
        "success": false,
        "message": "使用者資料不存在"
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

router.get(
  "/boards",
  isAuth,
  handleErrorAsync(userController.getAllBoards),
  function (req, res, next) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'B01-9	取得使用者所有工作區看板'
     * #swagger.security=[{"Bearer": []}]
      #swagger.responses[200] = {
      description: '成功',
      schema: 
      {
          "success": "true",
          "message": "查詢成功",
          "data": [  
                {
                    "_id": "6464da4e8844d84e7c8f9925",
                    "title": "工作區測試2",
                    "boards": [
                        {
                            "_id": "6464db227e0c240a99d3366c",
                            "title": "看板public",
                            "coverPath": ""
                        },
                        {
                            "_id": "6464e490315e6b9a156c854d",
                            "title": "看板works",
                            "coverPath": ""
                        }
                    ]
                },
                {
                    "_id": "6464c2a65d67e78ffc5c5d3d",
                    "title": "工作區測試1",
                    "boards": [
                        {
                            "_id": "6464c2fa5d67e78ffc5c5d49",
                            "title": "看板ws",
                            "coverPath": ""
                        },
                        {
                            "_id": "6464d2b1954391ea6c732455",
                            "title": "看板ws_2",
                            "coverPath": ""
                        }
                    ]
                }
            ]
        }

      }

      #swagger.responses[401] = {
        description: '身分驗證不通過',
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

router.put(
  "/reset-pwd",
  isAuth,
  handleErrorAsync(userController.updatePassword),
  function (req, res, next) {
    /**
     * #swagger.tags = ['User']
     * #swagger.summary = 'B01-10	更新密碼'
     * #swagger.security=[{"Bearer": []}]
      #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: 'email and password are required.',
      schema: {
        $password: "123456QWE",
        $confirmPassword:"123456QWE"
      }
      }

      #swagger.responses[200] = {
      description: '成功',
      schema: {
          "success": "true",
          "message": "更新密碼成功"
        }
      }

      
      #swagger.responses[401] = {
      description: '身分驗證不通過',
      schema: {
      "success": false,
      "message": "錯誤訊息"
      }
      }

      #swagger.responses[400] = {
      description: '使用者資料不存在',
      schema: {
      "success": false,
      "message": "使用者資料不存在"
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

module.exports = router;
