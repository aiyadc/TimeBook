import convert from "@/utils/convert.js";
export default [
  {
    label: "id",
    keyName: "tid",
    width: "",
    type: "text"
  },
  {
    label: "名称",
    keyName: "name",
    width: "",
    type: "text"
  },
  {
    label: "创建时间",
    keyName: "create_at",
    width: "",
    type: "text",
    formatter: row => convert.parseDatetime(row.create_at)
  },
  {
    label: "更新时间",
    keyName: "update_at",
    width: "",
    type: "text",
    formatter: row => convert.parseDatetime(row.update_at)
  },
  {
    label: "操作",
    width: "300",
    type: "slot",
    slot: "action"
  }
];
