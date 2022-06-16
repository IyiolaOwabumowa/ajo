export function separator(numb: number) {
  var str = numb?.toString().split('.');
  if (str) {
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return str.join('.');
  }
  return '';
}
