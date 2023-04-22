

export const isEmpty = (obj:Object) => {
    if(!obj) return true;
    return Object.keys(obj).length === 0;
}