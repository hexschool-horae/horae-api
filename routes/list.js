var express = require("express");
var router = express.Router();
const listController = require("../controllers/list");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth, isOkList } = require("../service/auth");

//B05-1 新增列表中卡片----------------------------------------------------------------------------------
router.post(
  "/:lID/card",
  isAuth,
  handleErrorAsync(listController.addCard),
  function (req, res, next) {
    /**
   * #swagger.tags = ['Card']
   * #swagger.summary = 'B05-1 新增列表中卡片'
   * #swagger.security=[{"Bearer": []}]
        #swagger.parameters['parameter_name'] = {
              in: 'body',
              description: 'B05-1 新增列表中卡片',
              schema: {
                   "title": "列表下的卡片",
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

//B04-2 修改列表標題---------------------------------------------------------------------------------
router.patch(
  "/:lID/title",
  isAuth,
  isOkList,
  handleErrorAsync(listController.updateListTitle),
  function (req, res, next) {
    /**
     * #swagger.tags = ['List']
     * #swagger.summary = 'B04-2 修改列表標題'
     * #swagger.security=[{"Bearer": []}]
		  #swagger.parameters['parameter_name'] = {
		        in: 'body',
		        description: 'B04-2 修改列表標題',
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

//B04-3	開啟/關閉單一列表---------------------------------------------------------------------------------
router.patch(
  "/:lID/status",
  isAuth,
  isOkList,
  handleErrorAsync(listController.updateListStatus),
  function (req, res, next) {
    /**
     * #swagger.tags = ['List']
     * #swagger.summary = 'B04-3	開啟/關閉單一列表'
     * #swagger.security=[{"Bearer": []}]
		  #swagger.parameters['parameter_name'] = {
		        in: 'body',
		        description: 'B04-3	開啟/關閉單一列表  open/close',
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
module.exports = router;
