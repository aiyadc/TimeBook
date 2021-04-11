import reverse from '@/utils/reverse.js';
export default [{
        label: '',
        width: '50',
        type: 'selection'
    },
    {
        label: 'id',
        keyName: 'tpid',
        width: '50',
        type: 'text'
    },
    {
        label: '主题',
        keyName: 'tid',
        width: '',
        type: 'slot',
        slot: 'tid'
    },
    {
        label: '名称',
        keyName: 'name',
        width: '',
        type: 'text'
    },
    {
        label: '封面',
        keyName: 'cover_url',
        width: '',
        type: 'slot',
        slot: 'cover_url'
    },
    {
        label: '照片数',
        keyName: 'count',
        width: '50',
        type: 'text'
    },
    {
        label: '创建时间',
        keyName: 'create_at',
        width: '',
        type: 'text',
        formatter: (row) => reverse.parseDatetime(row.create_at)
    },
    {
        label: '更新时间',
        keyName: 'update_at',
        width: '',
        type: 'text',
        formatter: (row) => reverse.parseDatetime(row.update_at)
    },
    {
        label: '人气',
        keyName: 'popularity',
        width: '50',
        type: 'text'
    },
    {
        label: '备注',
        keyName: 'remark',
        width: '',
        type: 'text'
    },
    {
        label: '是否上架',
        keyName: 'status',
        width: '',
        type: 'slot',
        slot: 'status'
    },
    {
        label: '操作',
        width: '300',
        type: 'slot',
        slot: 'action'
    },
]