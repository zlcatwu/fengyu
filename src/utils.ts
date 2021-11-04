function getBasicInfo() {
  const now = new Date();
  return {
    time: `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  };
}

type IMsg = {
  msg: string,
  module: string,
  devOnly?: boolean
};

const isDev = true;

function LOG(logFn: (str: string) => void, msg: IMsg) {
  const basic = getBasicInfo();
  // !(msg.devOnly && !isDev)
  if (!msg.devOnly) {
    logFn.call(null, `[${basic.time}].[${msg.module}]: ${msg.msg}`);
  }
}

export function TRACE(msg: IMsg) {
  LOG(console.trace, msg);
}

export function DEBUG(msg: IMsg) {
  LOG(console.debug, msg);
}

export function INFO(msg: IMsg) {
  LOG(console.info, msg);
}

// 没用到，降低我覆盖率，给扬了 =- =
// export function WARN(msg: IMsg) {
// LOG(console.warn, msg);
// }

// export function ERROR(msg: IMsg) {
// LOG(console.error, msg);
// }

export const tableCommonSymbol = Symbol('onSortChangeSymbol');
