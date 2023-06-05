import * as vscode from "vscode";

import { TagManager } from "./tagManager";
import { TagCategory } from "./types/tags";

export default class TagCompletions implements vscode.CompletionItemProvider {
  private tagManager: TagManager;

  constructor(tagManager: TagManager) {
    this.tagManager = tagManager;
  }

  public provideCompletionItems(): vscode.ProviderResult<
    vscode.CompletionItem[]
  > {
    const tags = this.tagManager.allTags;
    const stringTags = this.tagManager.allStringTags;

    const completions = stringTags.map((tag, i) => {
      const item = new vscode.CompletionItem(tag);

      switch (tags[i].category) {
        case TagCategory.general: {
          item.kind = vscode.CompletionItemKind.Constant;
          break;
        }
        case TagCategory.character: {
          item.kind = vscode.CompletionItemKind.Color;
          break;
        }
        case TagCategory.copyright: {
          item.kind = vscode.CompletionItemKind.Folder;
          break;
        }
        case TagCategory.artist: {
          item.kind = vscode.CompletionItemKind.User;
          break;
        }
        case TagCategory.meta: {
          item.kind = vscode.CompletionItemKind.Enum;
          break;
        }
        default: {
          item.kind = vscode.CompletionItemKind.Text;
        }
      }

      item.documentation = this.tagManager.createDocumentMarkdown(tags[i]);

      if (this.tagManager.config.trailingComma) {
        item.insertText = `${tag}, `;
      }

      return item;
    });

    if (this.tagManager.config.customTags) {
      completions.push(
        ...this.tagManager.config.customTags.map((tag) => {
          const item = new vscode.CompletionItem(tag);
          item.kind = vscode.CompletionItemKind.Event;
          return item;
        })
      );
    }

    return completions;
  }
}
