import { Component } from '@angular/core';
import { MentionItem } from './mention/mention-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public comments: string[] = [];

  public users: MentionItem[] = [
    { userID: 1, name: 'Kevin' },
    { userID: 2, name: 'Jeff' },
    { userID: 3, name: 'Bryan' },
    { userID: 4, name: 'Gabbey' },
  ];

  public newComment: string = '';

  public addComment() {
    if (this.newComment) {
      this.comments.push(this.newComment.replace(/(@\S+)/ig, '<strong>&nbsp;$1&nbsp;</strong>'));
      this.newComment = '';
    }
  }
}
