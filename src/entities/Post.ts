import { Base } from "./Base";

export class Post extends Base {
  title: string;
  content: string;
  author: string;

  constructor(title: string, content: string, author: string) {
    super()
    this.title = title; 
    this.content = content;
    this.author = author;
  }

}