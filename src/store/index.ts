import { atom } from "recoil";
import { Comment, Post } from "../interfaces";

export const postsState = atom<Post[]>({
    key: "posts",
    default: []
});

export const commentsState = atom<Comment[]>({
    key: "comments",
    default: []
});