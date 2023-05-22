export const nodeType = {
    DIALOGUE: 'dialogue',
    DEFAULT: 'default',
    OPTION: 'option',
    NODE_OPTION: 'node_option'
}
  
export const getNodeFollowedBy = (type) => {
    const defaultFollowedBy = [nodeType.DEFAULT, nodeType.OPTION];
    const optionFollowedBy = [nodeType.DEFAULT, nodeType.NODE_OPTION];
    return type === nodeType.DEFAULT ? defaultFollowedBy : optionFollowedBy
}
