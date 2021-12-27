

import { todayDate } from '../utils/utils';
import * as vscode from 'vscode';
import { SubmitContent } from '../interface/index';
import { OWNER, REPO, GET_ISSUES_URL, POST_COMMENT_URL } from '../common/constants';
import Vaildate from './vaildate';
let cansubmit: boolean = true;

/**
 * 获取issues列表
 * @param octokit 
 * @param context 
 * @param postMes 
 * @returns 
 */
export async function getIssuesList(octokit: any, context: vscode.ExtensionContext, postMes: Function) {
  postMes('info_webview', { text: '获取issues列表中....', type: 'info' });
  let storage: string | undefined = context.globalState.get('git_token_study_plan');
  if (!storage) {
    postMes('info_webview', { text: `请先配置git token`, type: 'err' });
    return;
  }
  try {
    let res = await octokit.request(GET_ISSUES_URL, {
      owner: OWNER,
      repo: REPO
    });
    issuesListHandle(res.status, res.data, postMes);
  } catch (error: any) {
    postMes('info_webview', { text: `${error.message}，获取issues列表失败，请手动配置issues_number`, type: 'err' });
  }
}

/**
 * 处理issues列表
 * @param status 
 * @param data 
 * @param postMes 
 * @returns 
 */
function issuesListHandle(status: number, data: any[], postMes: Function): void {
  const validate = new Vaildate;
  validate.addRules([
    {
      rule: status === 200,
      handle: () => {
        postMes('info_webview', { text: `获取issues列表失败，请手动配置issues_number`, type: 'err' });
      }
    },
    {
      rule: !!(data && data.length),
      handle: () => {
        postMes('info_webview', { text: `还未发布最新issues，请稍后重试`, type: 'info' });
      }
    },
    {
      rule: data[0].title.split('【每日计划】 ')[1] === todayDate(),
      handle: () => {
        postMes('info_webview', { text: `今日还未发布最新issues，请稍后重试`, type: 'info' });
      }
    }
  ]);
  if(!validate.check()) {
    return;
  }
  postMes('today_issue_number_webview', { number: data[0].number, title: data[0].title });
  postMes('info_webview', { text: '获取issues列表成功', type: 'success' });
}

/**
 * 提交
 * @param octokit 
 * @param content 
 * @param postMes 
 * @returns 
 */
export async function submit(octokit: any, content: SubmitContent, postMes: Function) {
  postMes('info_webview', { text: '提交中....', type: 'info' });
  if (!cansubmit) {
    return;
  }
  cansubmit = false;
  try {
    let res = await octokit.request(POST_COMMENT_URL, {
      owner: OWNER,
      repo: REPO,
      issue_number: content.number,
      body: content.body
    });
    const validate = new Vaildate;
    validate.addRule({
      rule: res.status === 201,
      handle: () => {
        postMes('info_webview', { text: '提交失败', type: 'err' });
      }
    });
    if(!validate.check()) {
      return;
    }
    postMes('success_webview', '提交成功！');
  } catch (error: any) {
    postMes('info_webview', { text: `${error.message}, 提交失败`, type: 'err' });

  }
  cansubmit = true;
}
