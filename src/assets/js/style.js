// 样式初始化
function issuesBtnStyle() {
  if (!issue_number.value) {
    issues_btn.classList.add('disabled');
  } else {
    issues_btn.classList.remove('disabled');
  }
}

function tokenBtnStyle() {
  if (!git_token.value) {
    token_btn.classList.add('disabled');
  } else {
    token_btn.classList.remove('disabled');
  }
}

function submitBtnStyle() {
  if (!git_token.value || !issue_number.value || !mdArea.value) {
    submit_btn.classList.add('disabled');
  } else {
    submit_btn.classList.remove('disabled');
  }
}