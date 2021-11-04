function getBasicInfo() {
  const now = new Date();
  return {
    time: `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  };
}

type IMsg = {
  msg: string,
  module: string
};

export function TRACE(msg: IMsg) {
  const basic = getBasicInfo();
  console.trace(`[${basic.time}].[${msg.module}]: ${msg.msg}`);
}

export function DEBUG(msg: IMsg) {
  const basic = getBasicInfo();
  console.debug(`[${basic.time}].[${msg.module}]: ${msg.msg}`);
}

export function INFO(msg: IMsg) {
  const basic = getBasicInfo();
  console.info(`[${basic.time}].[${msg.module}]: ${msg.msg}`);
}

// 没用到，降低我覆盖率，给扬了 =- =
// export function WARN(msg: IMsg) {
//   const basic = getBasicInfo();
//   console.warn(`[${basic.time}].[${msg.module}]: ${msg.msg}`);
// }

// export function ERROR(msg: IMsg) {
//   const basic = getBasicInfo();
//   console.error(`[${basic.time}].[${msg.module}]: ${msg.msg}`);
// }

export const tableCommonSymbol = Symbol('onSortChangeSymbol');
