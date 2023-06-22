var express = require("express");
var router = express.Router();
const workSpaceController = require("../controllers/workSpace");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth, isAuthWorkspace } = require("../service/auth");

//B02-1	新增工作區 ----------------------------------------------------------------------------------
router.post(
  "/",
  isAuth,
  handleErrorAsync(workSpaceController.addWorkSpace),
  function (req, res, next) {
    /**
   * #swagger.tags = ['WorkSpace']
   * #swagger.summary = 'B02-1	新增工作區'
   * #swagger.security=[{"Bearer": []}]
    #swagger.parameters['parameter_name'] = {
          in: 'body',
          description: 'B02-1	新增工作區',
          schema: {
            "title": "工作區測試",
            "discribe": "tttt",
            "viewSet":"public" 

          }
        }

    #swagger.responses[200] = {
    description: '成功',
    schema: {
          "success": "true",
          "message": "新增工作區成功",
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
//B02-2	取得登入者所有工作區清單----------------------------------------------------------------------------------
router.get(
  "/",
  isAuth,
  handleErrorAsync(workSpaceController.getWorkSpaces),
  function (req, res, next) {
    /**
 * #swagger.tags = ['WorkSpace']
 * #swagger.summary = 'B02-2	取得登入者所有工作區清單'
 * #swagger.security=[{"Bearer": []}]


  #swagger.responses[200] = {
  description: '成功',
  schema: {
    "success": "true",
    "message": "查詢成功",
    "data": [
        {
            "_id": "648b24f56c678f90a1a13f57",
            "title": "測試工作區tyyyy"
        },
        {
            "_id": "6489c2b26ae0a5420e741762",
            "title": "露易莎工作區"
        }
    ]
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
//B02-3	修改單一工作區資料(含權限)----------------------------------------------------------------------------------
router.patch(
  "/:wID",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.updateOneWorkSpace),
  function (req, res, next) {
    /**
   * #swagger.tags = ['WorkSpace']
   * #swagger.summary = 'B02-3	修改單一工作區資料(含權限)'
   * #swagger.security=[{"Bearer": []}]
    #swagger.parameters['parameter_name'] = {
          in: 'body',
          description: 'B02-3	修改單一工作區資料(含權限)',
          schema: {
              "title":"工作區123", 
              "discribe":"修改工作區修改12344",
              "viewSet":"private",
              "status":"open"
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
//B02-4	刪除單一工作區----------------------------------------------------------------------------------
router.delete(
  "/:wID",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.deleteOneWorkSpace),
  function (req, res, next) {
    /**
   * #swagger.tags = ['WorkSpace']
   * #swagger.summary = 'B02-4	刪除單一工作區'
   * #swagger.security=[{"Bearer": []}]


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
//B02-5	取得單一工作區----------------------------------------------------------------------------------
router.get(
  "/:wID",
  handleErrorAsync(workSpaceController.getOneWorkSpace),
  function (req, res, next) {
    /**    
     * #swagger.tags = ['WorkSpace']
     * #swagger.summary = 'B03-5 取得單一看板：除了工作區資訊外，會回傳 yourRole角色: visitor/admin/editor,yourPermission 瀏覽權限: viewOnly/edit。'
     * #swagger.security=[{"Bearer": []}]
     
    #swagger.responses[200] = {
      description: '成功',
      schema: {
    "success": "true",
    "message": "查詢成功，此為公開工作區",
    "data": {
        "_id": "6489c2b26ae0a5420e741762",
        "title": "露易莎工作區",
        "discribe": "露易莎工作區",
        "viewSet": "public",
        "status": "open",
        "members": [
            {
                "userId": {
                    "_id": "64743a4e5ac3abf5a47ae523",
                    "name": "Louisa",
                    "email": "louisa@gmail.com",
                    "avatar": "#BAAC9A"
                },
                "role": "admin",
                "_id": "6489c2b26ae0a5420e741763"
            },
            {
                "userId": {
                    "_id": "647344a57b31b0e84736f169",
                    "name": "testmm2",
                    "email": "testmm2@gmail.com",
                    "avatar": "#EDD8AB"
                },
                "role": "editor",
                "_id": "6489def7f7798604825aa0b2"
            }
        ],
        "inviteHashData": "883038357333",
        "boards": [
            {
                "_id": "6489de66f7798604825aa07c",
                "title": "看板標題",
                "coverPath": ""
            },
            {
                "_id": "6489e5d7eff7dec8315c1b01",
                "title": "看板0615",
                "coverPath": "https://images.unsplash.com/photo-1685268759630-a0c318007737?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0NjAwNTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODcyNDI0OTl8&ixlib=rb-4.0.3&q=85"
            },
            {
                "_id": "648d16677ed2700baed4a899",
                "title": "測試看板",
                "coverPath": ""
            }
        ],
        "createUser": "64743a4e5ac3abf5a47ae523",
        "createdAt": "2023-06-14T13:37:54.216Z",
        "__v": 7,
        "yourRole": "admin",
        "yourPermission": "edit"
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

//工作區成員相關
//B02-6	取得單一工作區成員----------------------------------------------------------------------------------
router.get(
  "/:wID/members",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.getWorkSpaceMembers),
  function (req, res, next) {
    /**
   * #swagger.tags = ['WorkSpace Member Setting']
   * #swagger.summary = 'B02-6	取得單一工作區成員'
   * #swagger.security=[{"Bearer": []}]

    #swagger.responses[200] = {
    description: '成功',
    schema: {
              "success": "true",
              "message": "查詢成功",
              "data": {
                  "title": "露易莎工作區",
                  "viewSet": "public",
                  "members": [
                      {
                          "userId": {
                              "_id": "64743a4e5ac3abf5a47ae523",
                              "name": "Louisa",
                              "email": "louisa@gmail.com",
                              "avatar": "#BAAC9A"
                          },
                          "role": "admin",
                          "_id": "6489c2b26ae0a5420e741763"
                      },
                      {
                          "userId": {
                              "_id": "647344a57b31b0e84736f169",
                              "name": "testmm2",
                              "email": "testmm2@gmail.com",
                              "avatar": "#EDD8AB"
                          },
                          "role": "editor",
                          "_id": "6489def7f7798604825aa0b2"
                      }
                  ]
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

//B02-7	單一工作區產生邀請連結
router.get(
  "/:wID/invitation-data",
  handleErrorAsync(workSpaceController.invitationData),
  function (req, res, next) {
    /**
   * #swagger.tags = ['WorkSpace Member Setting']
   * #swagger.summary = 'B02-7	單一工作區產生邀請連結'
   * #swagger.security=[{"Bearer": []}]

    #swagger.responses[200] = {
    description: '成功',
    schema: {
              "success": "true",
              "message": "查詢成功",
              "data": {
                  "title": "露易莎工作區",
                  "viewSet": "public",
                  "members": [
                      {
                          "userId": {
                              "_id": "64743a4e5ac3abf5a47ae523",
                              "name": "Louisa",
                              "email": "louisa@gmail.com",
                              "avatar": "#BAAC9A"
                          },
                          "role": "admin",
                          "_id": "6489c2b26ae0a5420e741763"
                      },
                      {
                          "userId": {
                              "_id": "647344a57b31b0e84736f169",
                              "name": "testmm2",
                              "email": "testmm2@gmail.com",
                              "avatar": "#EDD8AB"
                          },
                          "role": "editor",
                          "_id": "6489def7f7798604825aa0b2"
                      }
                  ]
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
//B02-8	單一工作區寄email給被邀請人
//B02-9	單一工作區新增成員----------------------------------------------------------------------------------
router.post(
  "/:wID/members/:hashData",
  isAuth,
  handleErrorAsync(workSpaceController.addWorkSpaceMembers),
  function (req, res, next) {
    /**
   * #swagger.tags = ['WorkSpace Member Setting']
   * #swagger.summary = 'B02-9	單一工作區新增成員'
   * #swagger.security=[{"Bearer": []}]

    #swagger.responses[200] = {
    description: '成功',
    schema: {
              "success": "true",
              "message": "查詢成功",
              "data": {
                  "title": "露易莎工作區",
                  "viewSet": "public",
                  "members": [
                      {
                          "userId": {
                              "_id": "64743a4e5ac3abf5a47ae523",
                              "name": "Louisa",
                              "email": "louisa@gmail.com",
                              "avatar": "#BAAC9A"
                          },
                          "role": "admin",
                          "_id": "6489c2b26ae0a5420e741763"
                      },
                      {
                          "userId": {
                              "_id": "647344a57b31b0e84736f169",
                              "name": "testmm2",
                              "email": "testmm2@gmail.com",
                              "avatar": "#EDD8AB"
                          },
                          "role": "editor",
                          "_id": "6489def7f7798604825aa0b2"
                      }
                  ]
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

//B02-10 單一工作區設定單一成員權限-----------------------------------------------------------------------------
router.patch(
  "/:wID/members",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.updateWorkSpaceMembers),
  function (req, res, next) {
    /**
   * #swagger.tags = ['WorkSpace Member Setting']
   * #swagger.summary = 'B02-10 單一工作區設定單一成員權限'
   * #swagger.security=[{"Bearer": []}]
    #swagger.parameters['parameter_name'] = {
          in: 'body',
          description: 'B02-3	修改單一工作區資料(含權限)',
          schema:{
            "role": "admin",
                "userId": "6464dc2e33d57ab33b4f9105"
            }
        }


    #swagger.responses[200] = {
    description: '成功',
    schema: {
              "success": "true",
              "message": "查詢成功",
              "data": {
                  "title": "露易莎工作區",
                  "viewSet": "public",
                  "members": [
                      {
                          "userId": {
                              "_id": "64743a4e5ac3abf5a47ae523",
                              "name": "Louisa",
                              "email": "louisa@gmail.com",
                              "avatar": "#BAAC9A"
                          },
                          "role": "admin",
                          "_id": "6489c2b26ae0a5420e741763"
                      },
                      {
                          "userId": {
                              "_id": "647344a57b31b0e84736f169",
                              "name": "testmm2",
                              "email": "testmm2@gmail.com",
                              "avatar": "#EDD8AB"
                          },
                          "role": "editor",
                          "_id": "6489def7f7798604825aa0b2"
                      }
                  ]
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
//B02-11 單一工作區刪除單一成員----------------------------------------------------------------------------------
router.delete(
  "/:wID/members",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.deleteWorkSpaceMembers),
  function (req, res, next) {
    /**
   * #swagger.tags = ['WorkSpace Member Setting']
   * #swagger.summary = 'B02-11 單一工作區刪除單一成員'
   * #swagger.security=[{"Bearer": []}]
    #swagger.parameters['parameter_name'] = {
          in: 'body',
          description: 'B02-3	修改單一工作區資料(含權限)',
          schema:{
            "userId":"647344a57b31b0e84736f169"
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

//B02-12 取得工作區邀請資料----------------------------------------------------------------------------------
router.post(
  "/:wID/invitation-link",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.invitationLink),
  function (req, res, next) {
    /**
   * #swagger.tags = ['WorkSpace Member Setting']
   * #swagger.summary = 'B02-12 取得工作區邀請資料-'
   * #swagger.security=[{"Bearer": []}]


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
