

let cansubmit: boolean = true;
let flag: boolean = false;
import { todayDate, getWebViewContent, storageHandle, initOctokit } from './utils/utils';
import * as vscode from 'vscode';
const path = require('path');


let octokit: any;

export function createCourseWebview(context: vscode.ExtensionContext) {

  octokit = initOctokit(context);

  if (flag) {
    return;
  }
  let src: string = process.env.NODE_ENV === 'production' ? 'dist/assets' : `src/assets`;
  let panel = vscode.window.createWebviewPanel('planWebview', "催学社每日学习计划", vscode.ViewColumn.One,       {
    // 只允许webview加载我们插件的`src/assets`目录下的资源
    localResourceRoots: [
      vscode.Uri.file(
        path.join(context.extensionPath, src),
      ),
    ],
    // 启用javascript
    enableScripts: true,
    retainContextWhenHidden: true, // 隐藏保存状态
  },);
  flag = true;
  const htmlPath = path.join(
    context.extensionPath,
    `${src}/template.html`,
  );
  panel.webview.html = getWebViewContent(context, htmlPath);
  panel.onDidDispose(() => {
    flag = false;
  }, null, context.subscriptions);

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    message => {
      messageHandle(message, context, panel.webview);
    },
    undefined,
    context.subscriptions
  );
}

export function messageHandle(message: any, context: vscode.ExtensionContext, webview: any) {
  switch (message.command) {
    case 'submit':
      submit(message.content, webview);
      break;
    case 'setStorage':
      let { key, value } = message.content;
      storageHandle(context).set(key, value);
      break;
    case 'getStorage':
      webview.postMessage({
        command: 'getStorage_webview',
        content: storageHandle(context).get(message.content.key),
        type: message.content.key
      });
      break;
    case 'initOct':
      octokit = initOctokit(context);
      getIssuesList(context, webview);
      break;
    case 'getIssuesList':
      getIssuesList(context, webview);
      break;
    default:
      break;
  }
}


async function getIssuesList(context: vscode.ExtensionContext, webview: any) {
  let storage: any = context.globalState.get('git_token_study_plan');
  if (!storage) {
    webview.postMessage({ command: 'err_webview', content: '请先配置git token' });
    return;
  }
  try {
    let res = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner: 'cuixiaorui',
      repo: 'study-every-day'
    });
    if (res.status === 200) {
      if (!res.data.length) {
        webview.postMessage({ command: 'err_webview', content: `还未发布最新issues，请稍后重试` });
        return;
      }
      if (res.data[0].title.split('【每日计划】 ')[1] !== todayDate()) {
        webview.postMessage({ command: 'err_webview', content: `今日还未发布最新issues，请稍后重试` });
        return;
      }
      webview.postMessage({
        command: 'today_issue_number_webview',
        content: { number: res.data[0].number, title: res.data[0].title }
      }
      );
    } else {
      webview.postMessage({ command: 'err_webview', content: `获取issues列表失败，请手动配置issues_number` });
    }
  } catch (error: any) {
    webview.postMessage({ command: 'err_webview', content: `${error.message}，获取issues列表失败，请手动配置issues_number` });
  }
}


async function submit(content: any, webview: any) {
  if (!cansubmit) {
    return;
  }
  cansubmit = false;
  try {
    let res = await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      owner: 'cuixiaorui',
      repo: 'study-every-day',
      issue_number: content.number,
      body: content.body
    });
    if (res.status === 201) {
      webview.postMessage({ command: 'success_webview', content: '提交成功！' });
    } else {
      webview.postMessage({ command: 'err_webview', content: '提交失败' });
    }
  } catch (error: any) {
    webview.postMessage({ command: 'err_webview', content: error.message });
  }
  cansubmit = true;
}
