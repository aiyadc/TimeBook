const userTable = [{
        label: "uid",
        width: "80",
        keyName: "uid",
        type: "text"
    },
    {
        label: "账号",
        width: "",
        keyName: "account",
        type: "text"
    },
    {
        label: '手机号',
        width: '',
        keyName: 'mobile',
        type: 'text'
    },
    {
        label: "邮箱",
        width: "",
        keyName: "mail",
        type: "text"
    },
    {
        label: "昵称",
        width: "",
        keyName: "nickname",
        type: "text"
    },
    {
        label: "地址",
        width: "",
        keyName: "address",
        hasTooltip: true,
        type: "text"
    },
    {
        label: "身份",
        width: "",
        keyName: "identity",
        type: "text"
    },
    {
        label: "创建",
        width: "",
        keyName: "create_at",
        type: "text"
    },
    {
        label: "状态",
        width: "",
        keyName: "status",
        type: "slot",
        slot: 'status'
    },
    {
        label: '操作',
        width: '',
        keyName: '',
        type: 'slot',
        slot: 'action'
    }
];
export default userTable;