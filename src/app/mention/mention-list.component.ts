import { Component, Output, EventEmitter } from '@angular/core';
import { MentionItem } from './mention-item';

@Component({
  selector: 'app-mention-list',
  templateUrl: './mention-list.component.html',
  styleUrls: ['./mention-list.component.css'],
})
export class MentionListComponent {
  public show: boolean = false;
  public items: MentionItem[] = [];
  public activeItem = 0;
  
  @Output() itemSelect = new EventEmitter<MentionItem>();

  public coords = { left : 0, top : 0 }
  
  position(left, top) {
    this.coords.left = left;
    this.coords.top = top;
  }

  public setListItems(items: MentionItem[]) {
    this.items = [...items];
  }

  public selectItem(item : MentionItem) {
    this.itemSelect.emit(item);
  }

  public resetActive() {
    this.activeItem = 0;
  }

  public moveDownActive() {
    this.activeItem = Math.min(this.activeItem + 1, this.items.length - 1);
  }

  public moveUpActive() {
    this.activeItem = Math.max(this.activeItem - 1, 0);
  }
}
