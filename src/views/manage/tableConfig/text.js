import reverse from '@/utils/reverse.js';
export default [{
        label: '',
        width: '50',
        type: 'selection'
    },
    {
        label: 'id',
        keyName: 'textid',
        width: '50',
        type: 'text'
    },
    {
        label: '主题',
        keyName: 'folderid',
        width: '',
        type: 'slot',
        slot: 'catalogid'
    },
    {
        label: '内容',
        keyName: 'text',
        width: '',
        type: 'text'
    },
    {
        label: '样式',
        keyName: 'style',
        width: '',
        type: 'text'
    },
    {
        label: '操作',
        width: '300',
        type: 'slot',
        slot: 'action'
    },
]