import * as vscode from "vscode";

import TagCompletions from "./completion";
import { TagConfig, TagManager } from "./tagManager";
import { CONFIG } from "./constant";
import TagDocumentHover from "./document";

export async function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("booru-tags");
  const tagConfig: Partial<TagConfig> = {
    general: config.get(CONFIG.USE_GENERAL_TAGS),
    character: config.get(CONFIG.USE_CHARACTER_TAGS),
    copyright: config.get(CONFIG.USE_COPYRIGHT_TAGS),
    artist: config.get(CONFIG.USE_ARTIST_TAGS),
    meta: config.get(CONFIG.USE_META_TAGS),
    withUnderscore: config.get(CONFIG.WITH_UNDERSCORE),
  };

  const tagManager = new TagManager(tagConfig, context.extensionPath);

  await tagManager.getAllTags();

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "plaintext",
      new TagCompletions(tagManager)
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      "plaintext",
      new TagDocumentHover(tagManager)
    )
  );
}