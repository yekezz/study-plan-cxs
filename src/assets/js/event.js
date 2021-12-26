/**
 * token输入框
 */
function tokenInput() {
  tokenBtnStyle();
  submitBtnStyle();
}

/**
 * issue参数输入框
 */
function issuesInput() {
  issuesBtnStyle();
  submitBtnStyle();
}

/**
 * token更新按钮
 * @returns 
 */
function updateToken() {
  if (!git_token.value) {
    return;
  }
  vscode.postMessage({
    command: 'setStorage',
    content: {
      key: 'git_token_study_plan',
      value: git_token.value
    }
  });
  vscode.postMessage({
    command: 'initOct'
  });
  tokenstatus.innerHTML = '已配置';
}

/**
 * issue参数更新
 * @returns 
 */
function updateIssuesParams() {
  if (issues_btn.classList.contains('disabled')) {
    return;
  }
}

/**
 * 插入模板
 */
function insert() {
  mdArea.innerHTML = `
## 每日计划
- [ ] 吃饭
- [ ] 睡觉
- [ ] 打豆豆
      `;
  mdConverter();
  submitBtnStyle();
}

/**
 * 插入上次提交内容
 */
function insertPre() {
  vscode.postMessage({
    command: 'getStorage',
    content: {
      key: 'pre_study_plan'
    }
  });
}

/**
 * 提交
 * @returns 
 */
function submit() {
  if (!mdArea.value || !issue_number.value || !git_token.value) {
    return;
  }
  vscode.postMessage({
    command: 'setStorage',
    content: {
      key: 'pre_study_plan',
      value: mdArea.value
    }
  });
  createLog(`信息(${formatDate(new Date)})：提交中...`);
  vscode.postMessage({
    command: 'submit',
    content: {
      body: mdArea.value,
      number: issue_number.value
    }
  });
}

/**
 * markdown 转换
 */
function mdConverter() {
  let md = mdArea.value;
  viewArea.innerHTML = marked.parse(md);
}

/**
 * 消息处理
 * @param {*} event 
 */
function messageHandle(event) {
  const message = event.data;
  console.log(message);
  switch (message.command) {
    case 'today_issue_number_webview':
      issueNumberHandle(message);
      break;
    case 'err_webview':
      createLog(`错误(${formatDate(new Date)})：${message.content}！`);
      break;
    case 'success_webview':
      mdArea.innerHTML = '';
      mdConverter();
      submitBtnStyle();
      createLog(`信息(${formatDate(new Date)})：${message.content}！`, false);
      break;
    case 'getStorage_webview':
      getStorageHandle(message.type, message.content);
      break;
    default:
      break;
  }
};

/**
 * 获取到今日issue
 * @param {*} message 
 */
function issueNumberHandle(message) {
  issue_number.value = message.content.number;
  issue_title.innerText = `今日issue：${message.content.title}`;
  issues_btn.classList.add('disabled');
  issues_btn.classList.add('display_none');
  issue_number.classList.add("display_none");
}

/**
 * 处理storage
 * @param {*} type 
 * @param {*} content 
 */
function getStorageHandle(type, content) {
  switch (type) {
    case 'pre_study_plan':
      try {
        mdArea.innerHTML = content || '';
        mdConverter();
        submitBtnStyle();
      } catch (error) {
        createLog(`错误(${formatDate(new Date)})：插入失败，请重试或者选择其他操作！`);
      }
      break;
    case 'git_token_study_plan':
      try {
        let token = content;
        git_token.value = token || '';
        console.log(token, git_token.value)
        tokenstatus.innerHTML = token ? '已配置' : '未配置（配置方法见下方提示）';
      } catch (error) {
        createLog(`错误(${formatDate(new Date)})：获取本地存储token参数失败，请重新填写！`);
      }
      tokenBtnStyle();
      break;
    default:
      break;
  }
}