const fs = require('fs');
const path = require('path');
import * as vscode from 'vscode';
const { Octokit } = require("@octokit/core");

/**
 * 获取template 内容
 * @param context 
 * @param templatePath 
 * @returns 
 */
export function getWebViewContent(templatePath: string) {
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
export function getExtensionFileAbsolutePath(context: vscode.ExtensionContext, relativePath: string) {
  return path.join(context.extensionPath, relativePath);
}

/**
 * 得到当天事件 年-月-日
 * @returns 
 */
export function todayDate() {
  let time = new Date();
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
}

/**
 * 存储操作
 * @param context 
 * @returns 
 */
export function storageHandle(context: vscode.ExtensionContext) {
  return {
    set: function (key: string, value: string) {
      context.globalState.update(key, value);
    },
    get: function (key: string) {
      return context.globalState.get(key);
    }
  };
}

/**
 * 在有token的情况下 初始化octokit
 * @param context 
 * @returns 
 */
export function initOctokit(context: vscode.ExtensionContext) {
  if (context.globalState.get('git_token_study_plan')) {
    return new Octokit({ auth: context.globalState.get('git_token_study_plan') });
  }
  return null;
}

/**
 * 判断 开发/ 生产环境
 * @returns 
 */
export function isProduction():boolean {
  return process.env.NODE_ENV === 'production';
}