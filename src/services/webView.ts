

let flag: boolean = false;
import { getWebViewContent, storageHandle, initOctokit, isProduction, getExtensionFileAbsolutePath } from '../utils/utils';
import * as vscode from 'vscode';
import { Message, Content } from '../interface/index';
import { DEV_PATH, PRO_PATH, TEMPLATE_NAME, WEBVIEW_TITLE, WEBVIEW_NAME } from '../common/constants';
import { getIssuesList, submit } from './service';

export default class WebView {
  public context: vscode.ExtensionContext;
  public panel!: vscode.WebviewPanel;
  public sourcePath: string;
  public octokit: any;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.sourcePath = isProduction() ? PRO_PATH : DEV_PATH;
  }

  /**
   * 创建webview
   * @returns 
   */
  public createCourseWebview():void {
    this.octokit = initOctokit(this.context);

    if (flag) {
      return;
    }

    this.panel = vscode.window.createWebviewPanel(WEBVIEW_NAME, WEBVIEW_TITLE, vscode.ViewColumn.One, {
      // 只允许webview加载我们插件的`src/assets`目录下的资源
      localResourceRoots: [
        vscode.Uri.file(
          getExtensionFileAbsolutePath(this.context, this.sourcePath)
        ),
      ],
      // 启用javascript
      enableScripts: true,
      retainContextWhenHidden: true, // 隐藏保存状态
    });

    flag = true;

    this.panel.webview.html = getWebViewContent(
      getExtensionFileAbsolutePath(this.context, `${this.sourcePath}/${TEMPLATE_NAME}`)
    );

    this.panel.onDidDispose(() => {
      flag = false;
    }, null, this.context.subscriptions);

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      message => {
        this.messageHandle(message);
      },
      undefined,
      this.context.subscriptions
    );
  }

  /**
   * 消息处理回调
   * @param message 
   */
  public messageHandle(message: Message):void {
    switch (message.command) {
      case 'submit':
        submit(this.octokit, message.content, this.postMessage.bind(this));
        break;
      case 'setStorage':
        let { key, value } = message.content;
        storageHandle(this.context).set(key, value);
        break;
      case 'getStorage':
        this.postMessage(
          'getStorage_webview',
          storageHandle(this.context).get(message.content.key),
          { type: message.content.key }
        );
        break;
      case 'initOct':
        this.octokit = initOctokit(this.context);
        getIssuesList(this.octokit, this.context, this.postMessage.bind(this));
        break;
      case 'getIssuesList':
        getIssuesList(this.octokit, this.context, this.postMessage.bind(this));
        break;
      default:
        break;
    }
  }

  /**
   * 发送消息 和 模板通信
   * @param command 
   * @param content 
   * @param params 
   */
  public postMessage(command: string, content:any, params: Content = {}):void {
    let mes = { command, content };
    mes = { ...mes, ...params };
    this.panel.webview.postMessage(mes);
  }
}