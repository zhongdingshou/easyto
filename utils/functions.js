var timestampToTime = function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
}
//分类
var classify = function classify(goods_category){
  switch (goods_category) {
            case 0: goods_category = '其他'; break;
            case 1: goods_category = '电子'; break;
            case 2: goods_category = '书籍'; break;
            case 3: goods_category = '体育'; break;
            case 4: goods_category = '生活';
          }
  return goods_category;
}
//判断链接
var judge = function judge(link){
  var s = link.substr(0, 1);//substr,第一个参数是开始索引(从0开始)，第二参数是截取的字符串的长度
  return s;
}
//去掉空格
var trim = function trim(str) {
  str = str.replace(/^(\s|\u00A0)+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
}



module.exports = {
  time: timestampToTime,
  classify: classify,
  judge: judge,
  trim: trim,
}