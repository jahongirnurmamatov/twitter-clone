import {atom} from 'recoil';

export const modalState = atom({
    key:'moduleState',
    default:false,
});

export const postIdState = atom({
    key:'postIdState',
    default:'',
})