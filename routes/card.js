var express = require("express");
var router = express.Router();
const cardController = require("../controllers/card");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth, isOkCard } = require("../service/auth");
const { isOkFile } = require("../service/uploadCheck");

router.get("/", isAuth, handleErrorAsync(cardController.filterCard)); //卡片篩選

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
		        description: 'B05-2	修改單一卡片(基本資訊) <br />時間格式>>Timestamp，無開始和結束日請皆填null，不可單一值填null <br />proiority >> 1：最高
 <br />2：高
 <br />3：中
 <br />4：低
 <br />空:無',
		        schema: {
                    "title": "修改卡片",
                    "describe": "測試566OOO",
                    "startDate":1685540000,  
                    "endDate":1685544000,
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
                            "_id": "645c605b54128783e9e56ae5",
                            "name": "testmm",
                            "email": "testmm@gmail.com",
                            "avatar": ""
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
                        "title": "todolist標題3",
                        "contentList": [
                          {
                            "_id": "64808969560b2eec198a0659",
                            "content": "todolist細項內容1",
                            "completed": false
                          }
                        ],
                        "_id": "647e014e018481af24cf1c96"
                      },
                      {
                        "title": "todolist標題3",
                        "contentList": [],
                        "_id": "647e016fb7914a5e75e73e5e"
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
                  "listId": "64871c60ab18a3b2728a563d",
                "boardId": "64871b1fab18a3b2728a5506",
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

//B05-8 移動卡片位置----------------------------------------------------------------------------------
router.patch(
  "/:cardID/position",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.moveCard),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card']
   * #swagger.summary = 'B05-8 移動卡片位置'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'finalListId卡片最後的列表ID。finalPosition 卡片最後的位置(位置起始值從0開始)',
              schema: {
		                  "finalListId":"64871b37ab18a3b2728a550f",
                      "finalPosition": 0
                  }
            }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "移動成功"
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
   * #swagger.tags = ['Card Comment Setting']
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
   * #swagger.tags = ['Card Comment Setting']
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
   * #swagger.tags = ['Card Comment Setting']
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

//B05-14 卡片todolist新增標題----------------------------------------------------------------------------------
router.post(
  "/:cardID/todolist",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.addCardTodolist),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Todolist Setting']
   * #swagger.summary = 'B05-14 卡片todolist新增標題'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-14 卡片todolist新增標題',
              schema: {
                    "title": "todolist標題",
                  }
            }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "成功加入todolist標題",
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

//B05-15 卡片todolist修改標題----------------------------------------------------------------------------------
router.put(
  "/:cardID/todolist",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.updateCardTodolist),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Todolist Setting']
   * #swagger.summary = 'B05-15 卡片todolist修改標題'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-15 卡片todolist修改標題',
              schema: {
					"titleId": "6470bc3c8c7c20876074788a",
					"title": "修改todolist標題",
                  }
            }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "Todolist修改成功"
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

//B05-16 卡片todolist刪除一組(標題+細項)----------------------------------------------------------------------------------
router.delete(
  "/:cardID/todolist",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.deleteCardTodolist),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Todolist Setting']
   * #swagger.summary = 'B05-16 卡片todolist刪除一組(標題+細項)'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-16 卡片todolist刪除一組(標題+細項)',
              schema: {
					          "titleId": "6470bc3c8c7c20876074788a",
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

//B05-17 卡片todolist新增細項---------------------------------------------------------------------------------
router.post(
  "/:cardID/todolist-content",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.addCardTodolistContent),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Todolist Setting']
   * #swagger.summary = 'B05-17 卡片todolist新增細項'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-17 卡片todolist新增細項。只填細項內容，程式completed預設false',
              schema: {
                    "titleId": "6470bc3c8c7c20876074788a",
                    "content": "todolist細項內容",
                  }
            }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "Todolist新增細項成功",
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

//B05-18 卡片todolist修改細項----------------------------------------------------------------------------------
router.put(
  "/:cardID/todolist-content",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.updateCardTodolistContent),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Todolist Setting']
   * #swagger.summary = 'B05-18 卡片todolist修改細項'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-18 卡片todolist修改細項。completed >> true/false',
              schema: {
                    "contentId":"648087d327da8d23aded69d1",
                    "content": "修改todolist細項內容",
                    "completed":true
                  }
            }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "todolist細項修改成功"
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

//B05-19 卡片todolist刪除一個細項----------------------------------------------------------------------------------
router.delete(
  "/:cardID/todolist-content",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.deleteCardTodolistContent),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Todolist Setting']
   * #swagger.summary = 'B05-19 卡片todolist刪除一個細項'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-19 卡片todolist刪除一個細項',
              schema: {
					            "contentId": "6470bc3c8c7c20876074788a",
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

//B05-20 卡片成員新增----------------------------------------------------------------------------------
router.post(
  "/:cardID/member",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.addCardMember),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Member Setting']
   * #swagger.summary = 'B05-20 卡片成員新增'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-20 卡片成員新增',
              schema: {
                   "memberId":"64743a4e5ac3abf5a47ae523"
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

//B05-21 卡片成員移除----------------------------------------------------------------------------------
router.delete(
  "/:cardID/member",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.deleteCardMember),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Member Setting']
   * #swagger.summary = 'B05-21 卡片成員移除'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-21 卡片成員移除',
              schema: {
                    "memberId":"64743a4e5ac3abf5a47ae523"
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

//B05-22 卡片中附件上傳----------------------------------------------------------------------------------
router.post(
  "/:cardID/attachment",
  isAuth,
  isOkCard,
  isOkFile,
  handleErrorAsync(cardController.addCardAttachment),
  function (req, res, next) {
    /**

     * #swagger.tags = ['Card Attachment Setting']
     * #swagger.summary = 'B05-22 卡片中附件上傳'
     * #swagger.security=[{"Bearer": []}],  
     #swagger.parameters['file'] = {
        in: 'formData',
        required: true,
      type: 'file',
      description: '附件檔案'
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
        description: '無檔案或格式不正確、上傳失敗',
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

//B05-23	卡片中附件刪除----------------------------------------------------------------------------------
router.delete(
  "/:cardID/attachment",
  isAuth,
  isOkCard,
  handleErrorAsync(cardController.deleteCardAttachment),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card Attachment Setting']
   * #swagger.summary = 'B05-23	卡片中附件刪除'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-23	卡片中附件刪除',
              schema: {
					      "fileId": "6470bc3c8c7c20876074788a",
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
