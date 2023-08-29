import {
  Directive,
  ElementRef,
  ViewContainerRef,
  HostListener,
  Input,
} from '@angular/core';
import { MentionListComponent } from './mention-list.component';
import { MentionItem } from './mention-item';
import { getCaretCoordinates } from './caret-coords';

const KEY_TAB = 9;
const KEY_ENTER = 13;
const KEY_SPACE = 32;
const KEY_BACKSPACE = 8;
const KEY_ESCAPE = 27;
const KEY_UP = 38;
const KEY_DOWN = 40;

interface MentionConfig {
  items: MentionItem[];
  triggerChar?: string;
}

@Directive({
  selector: '[mention]',
})
export class MentionDirective {
  private mentionConfig: MentionConfig = { items: [] };
  private filteredList: MentionItem[] = [];
  private isMenuDisplayed: boolean = false;

  private searchList: MentionListComponent;

  private DEFAULT_CONFIG: MentionConfig = {
    items: [],
    triggerChar: '@',
  };

  constructor(
    private _element: ElementRef<HTMLInputElement>,
    private _viewContainerRef: ViewContainerRef
  ) {}

  @Input('mention') set mention(mentionConfig: MentionConfig) {
    this.mentionConfig = mentionConfig;
  }

  get value() {
    return this._element.nativeElement.value;
  }

  set value(value: string) {
    this._element.nativeElement.value = value;

    if ('createEvent' in document) {
      let evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', true, false);
      this._element.nativeElement.dispatchEvent(evt);
    }
  }
  
  get caretPosition(): number {
    var val = this._element.nativeElement.value;
    return val.slice(0, this._element.nativeElement.selectionStart!).length;
  }

  set caretPosition(pos: number) {
    this._element.nativeElement.focus();
    this._element.nativeElement.setSelectionRange(pos, pos);
  }

  insertValue(start: number, end: number, text: string) {
    this.value = this.value.substring(0, start) + text + this.value.substring(end, this.value.length);
    this.caretPosition = start + text.length;
  }

  @HostListener('keydown', ['$event']) inputHandler(event: any) {
    if (event.key === (this.mentionConfig.triggerChar || this.DEFAULT_CONFIG.triggerChar)) {
      this.showSearchResult('', this.caretPosition);
      return true;
    }

    const startPos = this.value
      .slice(0, this.caretPosition)
      .lastIndexOf(this.mentionConfig.triggerChar || this.DEFAULT_CONFIG.triggerChar!);

    let pattern = this.value.slice(startPos + 1, this.caretPosition) + event.key;

    if (event.keyCode == KEY_ESCAPE) {
      this.hideSearch();
      return false;
    }

    if (this.isMenuDisplayed) {
      if (event.keyCode === KEY_TAB || event.keyCode === KEY_ENTER) {
        this.onSelectItem(this.filteredList[0]);
        return false;
      }
      if (event.keyCode === KEY_UP) {
        this.searchList.moveUpActive();
        return false;
      }
      if (event.keyCode === KEY_DOWN) {
        this.searchList.moveDownActive();
        return false;
      }
    }

    if (event.keyCode === KEY_BACKSPACE) {
      if (this.caretPosition == startPos + 1) {
        this.hideSearch();
        return true;
      }
      pattern = this.value.slice(startPos + 1, this.caretPosition - 1);
    }
    if (event.keyCode === KEY_SPACE) {
      this.hideSearch();
      return true;
    }

    if (startPos == -1) return true;

    if (!/^\S*$/.test(pattern)) {
      this.hideSearch();
      return true;
    }
    this.showSearchResult(pattern, startPos);

    return true;
  }

  @HostListener('blur', ['$event']) blurHandler(event: any) {
    this.hideSearch();
    return true;
  }

  getSearchResult(pattern: string): MentionItem[] {
    return this.mentionConfig.items.filter((item: MentionItem) =>
      new RegExp(pattern, 'ig').test(item.name)
    );
  }

  showSearchResult(pattern: string, startPos: number) {
    if (this.searchList == null) {
      let componentRef =
        this._viewContainerRef.createComponent(MentionListComponent);
      this.searchList = componentRef.instance;
      this.searchList.itemSelect.subscribe(this.onSelectItem);
    }

    this.filteredList = this.getSearchResult(pattern);
    if (this.filteredList.length == 0) {
      this.hideSearch();
      return;
    }

    this.isMenuDisplayed = true;

    this.searchList.show = true;
    this.searchList.setListItems(this.filteredList);
    this.searchList.resetActive();

    const coords = getCaretCoordinates(this._element.nativeElement, startPos, null);
    let { left, top } = this._element.nativeElement.getBoundingClientRect();
    coords.top = top + window.scrollY + coords.top;
    coords.left = left + window.scrollX + coords.left;

    this.searchList.position(coords.left, coords.top);
  }

  hideSearch() {
    if (this.searchList) this.searchList.show = false;
    this.isMenuDisplayed = false;
  }

  onSelectItem = (item: MentionItem) => {
    this.hideSearch();
    const startPos = this.value
      .slice(0, this.caretPosition)
      .lastIndexOf( this.mentionConfig.triggerChar || this.DEFAULT_CONFIG.triggerChar! );

    this.insertValue(startPos + 1, this.caretPosition, item.name + ' ');
  };
}
