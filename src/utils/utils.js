// 参数序列化
export function encodeFormData (data) {
  if (!data) return "";
  let pairs = [];
  for (let name in data) {
    if (!data.hasOwnProperty(name)) continue;
    if (typeof data[name] === "function") continue;
    let value = data[name].toString();
    name = encodeURIComponent(name.replace("%20", "+"));
    value = encodeURIComponent(value.replace("%20", "+"));
    pairs.push(name + "=" + value);
  }
  return pairs.join("&");
}