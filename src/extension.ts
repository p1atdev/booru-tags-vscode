import * as vscode from "vscode";

import TagCompletions from "./completion";
import { TagConfig, TagManager } from "./tagManager";
import { CONFIG } from "./constant";
import TagDocumentHover from "./document";

function getTagConfig(): Partial<TagConfig> {
  const config = vscode.workspace.getConfiguration("booru-tags");
  const tagConfig: Partial<TagConfig> = {
    general: config.get(CONFIG.USE_GENERAL_TAGS),
    character: config.get(CONFIG.USE_CHARACTER_TAGS),
    copyright: config.get(CONFIG.USE_COPYRIGHT_TAGS),
    artist: config.get(CONFIG.USE_ARTIST_TAGS),
    meta: config.get(CONFIG.USE_META_TAGS),
    withUnderscore: config.get(CONFIG.WITH_UNDERSCORE),
    customTags: config.get(CONFIG.CUSTOM_TAGS),
    filesToEnable: config.get(CONFIG.FILES_TO_ENABLE),
  };
  return tagConfig;
}

async function clearListners(context: vscode.ExtensionContext) {
  context.subscriptions.forEach((element) => {
    element.dispose();
  });
}

async function registerListners(context: vscode.ExtensionContext) {
  const tagConfig = getTagConfig();

  const tagManager = new TagManager(tagConfig, context.extensionPath);

  await tagManager.getAllTags();

  const registerCompletion = (selector: vscode.DocumentSelector) => {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        selector,
        new TagCompletions(tagManager)
      )
    );

    context.subscriptions.push(
      vscode.languages.registerHoverProvider(
        selector,
        new TagDocumentHover(tagManager)
      )
    );
  };

  for (const file of tagManager.config.filesToEnable) {
    registerCompletion({ scheme: "file", pattern: `**/*.${file}` });
  }

  for (const language of ["plaintext"]) {
    registerCompletion({ scheme: "untitled", language });
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("booru-tags.enable", async () => {
      console.log("booru-tags.enable");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("booru-tags.disable", async () => {
      console.log("booru-tags.disable");
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (event) => {
      // TODO: この方法でいいのか...?
      // 設定が変更されたら再読み込み
      if (event.affectsConfiguration("booru-tags")) {
        clearListners(context);
        await registerListners(context);
      }
    })
  );
}

export async function activate(context: vscode.ExtensionContext) {
  await registerListners(context);
}
