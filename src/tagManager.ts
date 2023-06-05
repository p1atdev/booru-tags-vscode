import * as vscode from "vscode";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { TagItem } from "./types/tags";
import { CONSTANT } from "./constant";
import { autoScalePrefix } from "./utils";

export interface TagConfig {
  general: boolean;
  character: boolean;
  copyright: boolean;
  artist: boolean;
  meta: boolean;
  withUnderscore: boolean;
  trailingComma: boolean;
  customTags: string[];
  filesToEnable: string[];
}

const DEFAULT_TAG_CONFIG: TagConfig = {
  general: true,
  character: true,
  copyright: true,
  artist: false,
  meta: true,
  withUnderscore: false,
  trailingComma: true,
  customTags: [],
  filesToEnable: ["txt"],
};

export class TagManager {
  config: TagConfig;
  allTags: TagItem[] = [];
  allStringTags: string[] = [];
  extensionPath: string;

  constructor(config: Partial<TagConfig>, extensionPath: string) {
    this.config = { ...DEFAULT_TAG_CONFIG, ...config };
    this.extensionPath = extensionPath;
  }

  public async updateConfig(config: Partial<TagConfig>) {
    this.config = { ...this.config, ...config };
    await this.getAllTags();
  }

  private async readTags(path: string): Promise<TagItem[]> {
    try {
      const data = await readFile(join(this.extensionPath, path), "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getGeneralTags(): Promise<TagItem[]> {
    return await this.readTags(CONSTANT.GENERAL_TAGS_JSON_PATH);
  }

  public async getCharacterTags(): Promise<TagItem[]> {
    return await this.readTags(CONSTANT.CHARACTER_TAGS_JSON_PATH);
  }

  public async getCopyrightTags(): Promise<TagItem[]> {
    return await this.readTags(CONSTANT.COPYRIGHT_TAGS_JSON_PATH);
  }

  public async getArtistTags(): Promise<TagItem[]> {
    return await this.readTags(CONSTANT.ARTIST_TAGS_JSON_PATH);
  }

  public async getMetaTags(): Promise<TagItem[]> {
    return await this.readTags(CONSTANT.META_TAGS_JSON_PATH);
  }

  public async transformTagsToCompletionItems(
    items: TagItem[],
    withUnderscore: boolean
  ): Promise<string[]> {
    const tags: string[] = items.map((item) => {
      if (withUnderscore) {
        return item.name;
      } else {
        const escapedWords = item.name.split("_");
        const words = item.words;
        if (escapedWords.length !== words.length && words.length === 1) {
          // >_<, @_@ など
          return item.name;
        }
        return escapedWords.join(" ");
      }
    });

    return tags;
  }

  public async getAllTags() {
    const { general, character, copyright, artist, meta, withUnderscore } =
      this.config;

    const tags: TagItem[] = [];

    // TODO: あとでここらへん並列で取得するように
    if (general) {
      tags.push(...(await this.getGeneralTags()));
    }
    if (character) {
      tags.push(...(await this.getCharacterTags()));
    }
    if (copyright) {
      tags.push(...(await this.getCopyrightTags()));
    }
    if (artist) {
      tags.push(...(await this.getArtistTags()));
    }
    if (meta) {
      tags.push(...(await this.getMetaTags()));
    }

    this.allTags = tags;

    this.allStringTags = await this.transformTagsToCompletionItems(
      tags,
      withUnderscore
    );
  }

  public getTagByName(name: string): TagItem | undefined {
    return this.allTags.find((tag) => tag.name === name);
  }

  public createDocumentMarkdown(tag: TagItem): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    markdown.supportHtml = true;
    markdown.isTrusted = true;

    const wikiUrl = `https://safebooru.donmai.us/wiki_pages/${tag.name}`;

    markdown.appendMarkdown(
      `<h2>${tag.name} - [${autoScalePrefix(tag.post_count)}]</h2>`
    );
    markdown.appendMarkdown(`
    <p><a href="${wikiUrl}">See on safebooru wiki page.</a></p>
  `);

    // TODO: iframeで直接wikiページ表示できるかな
    //   markdown.appendMarkdown(`
    //   <iframe src="${wikiUrl}" width="400" height="300"></iframe>
    //   `);

    return markdown;
  }
}
