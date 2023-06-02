var express = require("express");
var router = express.Router();
const boardController = require("../controllers/board");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth, isAuthBoard } = require("../service/auth");

//B03-1	新增看板 ----------------------------------------------------------------------------------
router.post(
  "/",
  isAuth,
  handleErrorAsync(boardController.addBoard),
  function (req, res, next) {
    /**
     * #swagger.tags = ['Board']
     * #swagger.summary = 'B03-1	新增看板'
     * #swagger.security=[{"Bearer": []}]
      #swagger.parameters['parameter_name'] = {
        in: 'body',
        description: 'B03-1	新增看板。工作區觀看權限 viewSet:private/public/workspace。 工作區狀態 status:open/close',
        schema: {
          "title": "看板標題",
          "discribe": "看板描述",
          "viewSet": "public",
          "workSpaceId": "6474a4d3377167fdb51a847e"
        }
      }

      #swagger.responses[200] = {
        description: '成功',
        schema: {
            "success": "true",
				    "message": "新增看板成功",
				    "data": "645f3f19fa5c06941e134dcc" 
        }
      }

      #swagger.responses[400] = {
          description: '欄位輸入錯誤，請重新輸入',
          schema: {
          "success": false,
          "message": "錯誤訊息"
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

//B03-2	修改單一看板權限---------------------------------------------------------------------------------
router.patch(
  "/:bID/viewSet",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.updateBoardViewSet),
  function (req, res, next) {
    /**
     * #swagger.tags = ['Board']
     * #swagger.summary = 'B03-2	修改看板權限'
     * #swagger.security=[{"Bearer": []}]
		  #swagger.parameters['parameter_name'] = {
		        in: 'body',
		        description: 'B03-2	修改看板權限  private/public',
		        schema: {
						    "viewSet":"private", 
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

//B03-3	單一看板封存設定 開啟/關閉---------------------------------------------------------------------------------
router.patch(
  "/:bID/status",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.updateBoardStatus),
  function (req, res, next) {
    /**
     * #swagger.tags = ['Board']
     * #swagger.summary = 'B03-3	看板封存設定 開啟/關閉'
     * #swagger.security=[{"Bearer": []}]
		  #swagger.parameters['parameter_name'] = {
		        in: 'body',
		        description: 'B03-3	看板封存設定 開啟/關閉  open/close',
		        schema: {
						    "status":"open", 
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

//B03-4	修改單一看板標題---------------------------------------------------------------------------------
router.patch(
  "/:bID/title",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.updateBoardTitle),
  function (req, res, next) {
    /**
     * #swagger.tags = ['Board']
     * #swagger.summary = 'B03-4	修改看板標題'
     * #swagger.security=[{"Bearer": []}]
		  #swagger.parameters['parameter_name'] = {
		        in: 'body',
		        description: 'B03-4	修改看板標題',
		        schema: {
						    "title":"修改標題名稱", 
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

// //B03-5 取得單一看板----------------------------------------------------------------------------------
router.get(
  "/:bID",
  handleErrorAsync(boardController.getOneBoard),
  function (req, res, next) {
    /**
     * #swagger.tags = ['Board']
     * #swagger.summary = 'B03-5 取得單一看板'
     * #swagger.security=[{"Bearer": []}]
     
    #swagger.responses[200] = {
      description: '成功',
      schema: {
				    "success": "true",
				    "message": "查詢成功，此為公開看板",
				    "data": {
				        "_id": "645f819ca1afcf59db7fd99d",
				        "title": "b看板",
				        "discribe": "測試",
				        "coverPath": "",
				        "viewSet": "public",
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
				        "lists": [
				            {
				                "_id": "645f81c8a1afcf59db7fd9a2",
				                "title": "b看板下的列表1",
												"status": "open",
				                "position": 1
				            },
				            {
				                "_id": "646e06aeefa6a56d586ef349",
				                "title": "看板下的列表24",
				                "status": "open",
				                "position": 2,
				                "cards": [
														{
				                        "_id": "646df7e441cae2638c51f057",
				                        "title": "列表下的卡片ddd",
				                        "startDate": null,
				                        "endDate": null,
				                        "tags": [],
				                        "proiority": "",
				                        "position": 1
				                    },
				                    {
				                        "_id": "646df81a41cae2638c51f05e",
				                        "title": "列表下的卡片",
                                "startDate": 1685540000,
                                "endDate": 1685544000,
                                "tags": [
                                    {
                                        "_id": "6478b1de7ef5d7ac56a2f7ed",
                                        "title": "QQQQ",
                                        "color": "#FFF111"
                                    }
                                ],
                                "comments": [
                                    {
                                        "_id": "6479f9e8977d886d90bd9b5b",
                                        "comment": "評論內容",
                                        "user": {
                                            "_id": "64743a4e5ac3abf5a47ae523",
                                            "name": "louisa",
                                            "createdAt": "2023-05-29T05:38:22.933Z"
                                        },
                                        "card": "647897f27396e0c9129bf051"
                                    }
                                ],
				                        "proiority": "",
				                        "position": 2
				                    }
												]
									}
				        ],
				        "yourRole": "visitor",
				        "yourPermission": "viewOnly"
				    }
				}
      }

       #swagger.responses[400] = {
          description: '您的請求參數有誤',
          schema: {
          "success": false,
          "message": "您的請求參數有誤"
          }
      }

      #swagger.responses[401] = {
          description: '此為私人看板，需先驗證',
          schema:{
							"success": false,    
							"message": "此為私人看板，訪客請先登入" 
					}
      }

      #swagger.responses[403] = {
          description: '此為私人看板，無權限',
          schema: {
							"success": false,    
							"message": "此為私人看板，您不是看板成員，不可查看"
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

//B04-1	新增看板中列表----------------------------------------------------------------------------------
router.post(
  "/:bID/list",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.addlist),
  function (req, res, next) {
    /**
     * #swagger.tags = ['List']
     * #swagger.summary = 'B04-1	新增看板中列表'
     * #swagger.security=[{"Bearer": []}]
		  #swagger.parameters['parameter_name'] = {
		        in: 'body',
		        description: 'BB04-1	新增看板中列表',
		        schema: {
						  "title": "看板下的列表"
						}
		      }

      #swagger.responses[200] = {
      description: '成功',
      schema: {
				    "success": "true",
				    "message": "新增列表成功",
				    "data": "645f3f19fa5c06941e134dcc" 
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

//標籤相關
//B03-13	取得單一看板的所有標籤-------------------------------------------------------------------------------
router.get(
  "/:bID/tags",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.getTags),
  function (req, res, next) {
    /**
     * #swagger.tags = ['Board Tag']
     * #swagger.summary = 'B03-13 取得看板的所有標籤'
     * #swagger.security=[{"Bearer": []}]
			  

      #swagger.responses[200] = {
      description: '成功',
      schema: {
				    "success": "true",
				    "message": "成功",
				    "data": [
				        {
				            "_id": "6470c8a3677fcdeca580d535",
				            "title": "ACCll",
				            "color": "#FFF1F4",
				            "boardId": "646e1eb64b0a262ea43b63f1",
				            "__v": 0
				        },
				        {
				            "_id": "6470c8bf7da72f9e5433755e",
				            "title": "Reace",
				            "color": "#FFF1F2",
				            "boardId": "646e1eb64b0a262ea43b63f1",
				            "__v": 0
				        },
				        {
				            "_id": "6470ccf299571552b8ec6e57",
				            "title": "RR",
				            "color": "#FFF132",
				            "boardId": "646e1eb64b0a262ea43b63f1",
				            "__v": 0
				        }
				    ]
				}
      }

      #swagger.responses[400] = {
          description: '您的請求參數有誤',
          schema: {
          "success": false,
          "message": "您的請求參數有誤"
          }
      }

      #swagger.responses[401] = {
        description: '身分驗證不通過',
        schema: {
        "success": false,
        "message": "錯誤訊息"
        }
      }


      #swagger.responses[403] = {
        description: '沒有權限',
        schema: {
        "success": false,
        "message": "您沒有此看板權限"
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

//B03-14	單一看板新增標籤-------------------------------------------------------------------------------------
router.post(
  "/:bID/tags",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.addTag),
  function (req, res, next) {
    /**
     * #swagger.tags = ['Board Tag']
     * #swagger.summary = 'B03-14 看板新增標籤'
     * #swagger.security=[{"Bearer": []}]
		  #swagger.parameters['parameter_name'] = {
		        in: 'body',
		        description: 'B03-14 看板新增標籤',
		        schema: {
						  "title": "RR",
						  "color":"#FFF132"
						}
		      }		  

      #swagger.responses[200] = {
      description: '成功',
      schema: {
				    "success": "true",
				    "message": "新增標籤成功",
				}
      }

      #swagger.responses[400] = {
          description: '您的請求參數有誤',
          schema: {
          "success": false,
          "message": "您的請求參數有誤"
          }
      }

      #swagger.responses[401] = {
        description: '身分驗證不通過',
        schema: {
        "success": false,
        "message": "錯誤訊息"
        }
      }


      #swagger.responses[403] = {
        description: '沒有權限',
        schema: {
        "success": false,
        "message": "您沒有此看板權限"
        }
      }

     #swagger.responses[404] = {
          description: '查無資料',
          schema: {
          "success": false,
          "message": "查無資料"
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

//B03-15	單一看板設定單一標籤、修改標籤---------------------------------------------------------------------------------
router.put(
  "/:bID/tags",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.updateTag),
  function (req, res, next) {
    /**
     * #swagger.tags = ['Board Tag']
     * #swagger.summary = 'B03-15 看板修改標籤'
     * #swagger.security=[{"Bearer": []}]
		  #swagger.parameters['parameter_name'] = {
		        in: 'body',
		        description: 'B03-15 看板修改標籤',
		        schema: {
						  "tagId": "6470c8a3677fcdeca580d535",
						  "title": "React",
						  "color":"#FFF1F1"
						}
		      }		  

      #swagger.responses[200] = {
      description: '成功',
      schema: {
				    "success": "true",
				    "message": "標籤設定成功",
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
      #swagger.responses[403] = {
        description: '沒有權限',
        schema: {
        "success": false,
        "message": "您沒有此看板權限"
        }
      }

      #swagger.responses[404] = {
          description: '查無此看板',
          schema: {
          "success": false,
          "message": "查無此看板"
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

//B03-16	單一看板刪除標籤-------------------------------------------------------------------------------------
router.delete(
  "/:bID/tags",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.deleteTag),
  function (req, res, next) {
    /**
     * #swagger.tags = ['Board Tag']
     * #swagger.summary = 'B03-16 看板刪除標籤'
     * #swagger.security=[{"Bearer": []}]
		  #swagger.parameters['parameter_name'] = {
		        in: 'body',
		        description: 'B03-16 看板刪除標籤',
		        schema: {
						  "tagId": "6470c8a3677fcdeca580d535",
						}
		      }		  

      #swagger.responses[200] = {
      description: '成功',
      schema: {
				    "success": "true",
				    "message": "刪除成功",
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

      #swagger.responses[403] = {
        description: '沒有權限',
        schema: {
        "success": false,
        "message": "您沒有此看板權限"
        }
      }


      #swagger.responses[404] = {
          description: '查無此看板',
          schema: {
          "success": false,
          "message": "查無此看板"
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
