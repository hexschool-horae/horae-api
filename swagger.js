const swaggerAutogen = require("swagger-autogen")();
const definitions = require("./swagger-defintion");

const doc = {
  info: {
    title: "Horae 女神力 API",
    description:
      "Horae是希臘神話中掌管時間和秩序的女神，把掌握時間這個精神作為主題的看板生產力工具。提供團隊協作功能，並結合計時、番茄鐘等專注工具。致力為團隊累積進度，穩健邁向專案目標。",
  },
  host: process.env.BACK_END,
  schemes: ["https", "http"],
  tags: [
    { name: "User", description: "使用者相關" },
    { name: "WorkSpace", description: "工作區相關" },
    { name: "Board", description: "看板相關" },
    { name: "Board Tag", description: "看板標籤相關" },
    { name: "Board Member Setting", description: "看板成員事項相關" },
    { name: "List", description: "列表相關" },
    { name: "Card", description: "卡片相關" },
    { name: "Card Tag Setting", description: "卡片標籤設定相關" },
    { name: "Card Comment Setting", description: "卡片評論相關" },
    { name: "Card Todolist Setting", description: "卡片代辦事項相關" },
  ],
  definitions,
  securityDefinitions: {
    // Token
    Bearer: {
      type: "apiKey",
      in: "headers", // can be "header", "query" or "cookie"
      name: "authorization", // name of the header, query parameter or cookie
      description: "請加上 API Token",
    },
  },
};

const outputFile = "./swagger-output.json";

// 進入點/注入點，分析 router 和自動生成
const endpointsFiles = ["./app.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
