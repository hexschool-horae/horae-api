var express = require("express");
var router = express.Router();
const cardController = require("../controllers/card");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth, isOkCard } = require("../service/auth");

router.get("/", isAuth, handleErrorAsync(cardController.filterCard)); //卡片篩選

//B05-4 取得單一卡片----------------------------------------------------------------------------------
router.get(
  "/:cardID",
  isAuth,
  handleErrorAsync(cardController.getOneCard),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card']
   * #swagger.summary = 'B05-4 取得單一卡片'
   * #swagger.security=[{"Bearer": []}]


    #swagger.responses[200] = {
    description: '成功',
    schema:{
            "success": "true",
            "message": "查詢成功",
            "data": {
                "_id": "6477671324f9d22235b4e68b",
                "title": "B看板66U",
                "describe": "測試566OOO",
                "startDate": 1685540000,
                "endDate": 1685540000,
                "members": [
                        {
                            "userId": {
                                "_id": "644e5d4a2be1aa32974e10d1",
                                "name": "g"
                            },
                            "role": "admin",
                            "_id": "645f819ca1afcf59db7fd99e"
                        }
                    ],
                    "comments": [
                        {
                            id: "",
                            content: "",
                            createdAt: "",
                            user: {
                                "_id": "644e5d4a2be1aa32974e10d1",
                                "name": "g"
                            }
                        }
                    ],
                    "tags": [
                        {
                          "_id": "6478b1de7ef5d7ac56a2f7ed",
                          "title": "QQQQ",
                          "color": "#FFF111"
                        }
                    ],
                    "todolists": [
                        {
                            id: "",
                            title: "", 
                            contentList:[{
                                content: "",
                                completed: Boolean,
                            }]
                        }
                    ],
                    "attachments": [
                        {
                            id: "",
                            createdAt: "",
                            title: "",
                            url: "",
                        }
                    ],
                "proiority": "3",
                "coverPath": "",
                "position": 8,
                "updateUser": "64743a4e5ac3abf5a47ae523",
                "createdAt": "2023-05-31T15:26:11.928Z",
                "updateAt": "2023-05-31T15:51:52.484Z",
                "version": 0
            }
        }
    }


    #swagger.responses[400] = {
        description: '欄位輸入錯誤，請重新輸入',
        schema: {
        "success": false,
        "message": "欄位輸入錯誤，請重新輸入"
        }
    }

    #swagger.responses[401] = {
      description: '身分驗證不通過',
      schema: {
      "success": false,
      "message": "身分驗證不通過相關錯誤訊息"
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

//B05-2	修改單一卡片(基本資訊)----------------------------------------------------------------------------------
router.patch(
  "/:cardID",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.updateCardData),
  function (req, res, next) {
    /**
     * #swagger.tags = ['Card']
     * #swagger.summary = 'B05-2	修改單一卡片(基本資訊)'
     * #swagger.security=[{"Bearer": []}]
		  #swagger.parameters['parameter_name'] = {
		        in: 'body',
		        description: 'B05-2	修改單一卡片(基本資訊) <br />時間格式>>Timestamp <br />proiority >> 1：最高
 <br />2：高
 <br />3：中
 <br />4：低
 <br />空:無',
		        schema: {
                    "title": "B看板66U",
                    "describe": "測試566OOO",
                    "startDate":"1685540000",  
                    "endDate":"1685544000",
                    "proiority":"3"
                    }
		      }

      #swagger.responses[200] = {
      description: '成功',
      schema: {
            "success": "true",
            "message": "修改成功"
        }
      }


      #swagger.responses[400] = {
          description: '欄位輸入錯誤，請重新輸入',
          schema: {
          "success": false,
          "message": "欄位輸入錯誤，請重新輸入"
          }
      }

      #swagger.responses[401] = {
        description: '身分驗證不通過',
        schema: {
        "success": false,
        "message": "身分驗證不通過相關錯誤訊息"
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

//B05-9 在卡片新增標籤----------------------------------------------------------------------------------
router.post(
  "/:cardID/tag",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.addCardTag),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Tag Setting']
   * #swagger.summary = 'B05-9 在卡片新增標籤'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-9 在卡片新增標籤',
              schema: {
                    "tagId": "6470bc3c8c7c20876074763a",
                  }
            }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "新增成功"
      }
    }

    #swagger.responses[400] = {
        description: '欄位輸入錯誤，請重新輸入',
        schema: {
        "success": false,
        "message": "欄位輸入錯誤，請重新輸入"
        }
    }

    #swagger.responses[401] = {
      description: '身分驗證不通過',
      schema: {
      "success": false,
      "message": "身分驗證不通過相關錯誤訊息"
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

//B05-10 在卡片移除標籤----------------------------------------------------------------------------------
router.delete(
  "/:cardID/tag",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.deleteCardTag),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Tag Setting']
   * #swagger.summary = 'B05-10 在卡片移除標籤'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-10 在卡片移除標籤',
              schema: {
                    "tagId": "6470bc3c8c7c20876074763a",
                  }
            }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "移除成功"
      }
    }

    #swagger.responses[400] = {
        description: '欄位輸入錯誤，請重新輸入',
        schema: {
        "success": false,
        "message": "欄位輸入錯誤，請重新輸入"
        }
    }

    #swagger.responses[401] = {
      description: '身分驗證不通過',
      schema: {
      "success": false,
      "message": "身分驗證不通過相關錯誤訊息"
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

//B05-11 卡片評論新增----------------------------------------------------------------------------------
router.post(
  "/:cardID/comment",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.addCardComment),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Comment']
   * #swagger.summary = 'B05-11 卡片評論新增'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-11 卡片評論新增',
              schema: {
                    "comment": "評論內容",
                  }
            }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "新增成功",
		  "data": "6470bc3c8c7c20876074788a"
      }
    }

    #swagger.responses[400] = {
        description: '欄位輸入錯誤，請重新輸入',
        schema: {
        "success": false,
        "message": "欄位輸入錯誤，請重新輸入"
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

//B05-12 卡片評論修改----------------------------------------------------------------------------------
router.put(
  "/:cardID/comment",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.updateCardComment),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Comment']
   * #swagger.summary = 'B05-12 卡片評論修改'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-12 卡片評論修改',
              schema: {
					"commentId": "6470bc3c8c7c20876074788a",
					"comment": "修改評論內容",
                  }
            }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "修改成功"
      }
    }

    #swagger.responses[400] = {
        description: '欄位輸入錯誤，請重新輸入',
        schema: {
        "success": false,
        "message": "欄位輸入錯誤，請重新輸入"
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

//B05-13 卡片評論刪除----------------------------------------------------------------------------------
router.delete(
  "/:cardID/comment",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.deleteCardComment),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Comment']
   * #swagger.summary = 'B05-13 卡片評論刪除'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-13 卡片評論刪除',
              schema: {
					"commentId": "6470bc3c8c7c20876074788a",
                  }
            }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "刪除成功"
      }
    }

    #swagger.responses[400] = {
        description: '欄位輸入錯誤，請重新輸入',
        schema: {
        "success": false,
        "message": "欄位輸入錯誤，請重新輸入"
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

module.exports = router;
