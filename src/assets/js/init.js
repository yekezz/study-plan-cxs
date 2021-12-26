// 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
const vscode = acquireVsCodeApi();
let mdArea = document.querySelector('#md-area');
let viewArea = document.querySelector('#view-area');
let log = document.querySelector('#log');
let git_token = document.querySelector('#git_token');
let issue_title = document.querySelector('#issue_title');
let issue_number = document.querySelector('#issue_number');
let tokenstatus = document.querySelector('#tokenstatus');
let issues_btn = document.querySelector('#issues_btn');
let token_btn = document.querySelector('#token_btn');
let submit_btn = document.querySelector('#submit_btn');



function init() {
  getIssuesList();
  getInitState();
  submitBtnStyle();
}

/**
 * 获取存储内容
 */
function getInitState() {
  vscode.postMessage({
    command: 'getStorage',
    content: {
      key: 'git_token_study_plan'
    }
  });
}

/**
 * 获取issues列表，获取今日最新的issue
 */
function getIssuesList(number) {
  vscode.postMessage({
    command: 'getIssuesList',
    content: {
      number
    }
  });
}

/**
 * 提交按钮初始化
 */
function submitBtnStyle() {
  if (!git_token.value || !issue_number.value || !mdArea.value) {
    submit_btn.classList.add('disabled');
  } else {
    submit_btn.classList.remove('disabled');
  }
}