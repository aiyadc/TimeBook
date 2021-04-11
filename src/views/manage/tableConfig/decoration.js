export default [{
        label: "",
        width: "50",
        type: "selection"
    },
    {
        label: "id",
        keyName: "did",
        width: "50",
        type: "text"
    },
    {
        label: "主题",
        keyName: "tid",
        width: "",
        type: "slot",
        slot: "tid"
    },
    {
        label: "名称",
        keyName: "name",
        width: "",
        type: "text"
    },
    {
        label: "图片",
        keyName: "src",
        width: "",
        type: "slot",
        slot: "src"
    },
    {
        label: "宽度",
        keyName: "width",
        width: "",
        type: "text"
    },
    {
        label: "高度",
        keyName: "height",
        width: "",
        type: "text"
    },
    {
        label: "来源",
        keyName: "origin",
        width: "",
        type: "text",
        formatter: row => row.origin || "--"
    },
    {
        label: "",
        keyName: "popularity",
        width: "50",
        type: "text"
    },
    {
        label: "操作",
        width: "300",
        type: "slot",
        slot: "action"
    }
];