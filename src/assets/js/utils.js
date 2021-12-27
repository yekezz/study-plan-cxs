function formatDate(str) {
  return `${str.getHours()}:${str.getMinutes()}:${str.getSeconds()}`;
}

/**
 * 创建日志
 * @param {*} content : ;
 * @param {*} err 
 */
function createLog(content, type = 'err') {
  console.log(content, type, 99999999999);
  let li = document.createElement('li');
  li.innerText = tipType(content)[type] || '';
  colorType[type] && li.classList.add(colorType[type]);
  log.appendChild(li);
}

const colorType = {
  success: 'col_49',
  info: 'col_ffa'
};

const tipType = (message) => {
  return {
    err: `错误(${formatDate(new Date)})：${message}`,
    success: `成功(${formatDate(new Date)})：${message}`,
    info: `信息(${formatDate(new Date)})：${message}`
  };
};