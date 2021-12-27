// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import WebView from './services/webView';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('studyplancxs.studyplancxs', function () {
		// WebView初始化
		let webview = new WebView(context);
		// 创建webview
		webview.createCourseWebview();
	}));
}

// this method is called when your extension is deactivated
export function deactivate() { }
