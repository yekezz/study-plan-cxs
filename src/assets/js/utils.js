function formatDate(str) {
  return `${str.getHours()}:${str.getMinutes()}:${str.getSeconds()}`;
}

/**
 * 创建日志
 * @param {*} content : ;
 * @param {*} err 
 */
function createLog(content, err = true) {
  let li = document.createElement('li');
  li.innerText = content;
  !err && li.classList.add('col_49');
  log.appendChild(li);
}