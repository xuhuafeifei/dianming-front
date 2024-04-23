// 转base64码
export const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let fileResult = "";
    reader.readAsDataURL(file);
    // 开始转
    reader.onload = () => {
      fileResult = reader.result as string;
    };
    // 转 失败
    reader.onerror = error => {
      reject(error);
    };
    // 转 结束
    reader.onloadend = () => {
      resolve(fileResult);
    };
  });
};
