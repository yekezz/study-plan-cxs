const fs = require('fs');
const path = require('path');
import * as vscode from 'vscode';
const { Octokit } = require("@octokit/core");


export function getWebViewContent(context: any, templatePath: string) {
  // const resourcePath = getExtensionFileAbsolutePath(context, templatePath);
  const dirPath = path.dirname(templatePath);
  let html = fs.readFileSync(templatePath, 'utf-8');
  html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m: any, $1: any, $2: any) => {
    return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({
      scheme: 'vscode-resource'
    }).toString() + '"';
  });
  return html;
}

/**
* 获取某个扩展文件绝对路径
* @param context 上下文
* @param relativePath 扩展中某个文件相对于根目录的路径，如 images/test.jpg
*/
function getExtensionFileAbsolutePath(context: any, relativePath: string) {
  return path.join(context.extensionPath, relativePath);
}

export function todayDate() {
  let time = new Date();
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
}

export function storageHandle(context: any) {
  return {
    set: function (key: string, value: string) {
      context.globalState.update(key, value);
    },
    get: function (key: string) {
      return context.globalState.get(key);
    }
  };
}


export function initOctokit(context: any) {
  if (context.globalState.get('git_token_study_plan')) {
    return new Octokit({ auth: context.globalState.get('git_token_study_plan') });
  }
  return null;
}