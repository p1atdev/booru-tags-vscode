import * as vscode from "vscode";

import { TagManager } from "./tagManager";

export default class TagDocumentHover implements vscode.HoverProvider {
  private tagManager: TagManager;

  constructor(tagManager: TagManager) {
    this.tagManager = tagManager;
  }

  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position);
    const word = document.getText(range);
    const tag = this.tagManager.getTagByName(word);

    if (tag) {
      const markdown = this.tagManager.createDocumentMarkdown(tag);

      return new vscode.Hover(markdown);
    }
  }
}
