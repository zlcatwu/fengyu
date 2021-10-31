// 请使用优化以下代码：

// 假设已经存在以下3个函数，3个函数的功能都是向服务器上传文件，根据不同的上传类型参数都会不一样。内容的实现这里无须关注
// 请重新设计一个功能，根据不同文件的后缀名，上传到不同的服务器。
// txt 上传到 ftp
// exe 上传到 sftp
// doc 上传到 http
function uploadByFtp (file: string): Promise<boolean> {
  return new Promise(resolve => resolve(true))
}
function uploadBySftp (file: string[], cb: (ret: boolean) => void): void {
  cb(true)
}
function uploadByHttp (file: string): boolean {
  return true
}

// 老的实现如下
function upload (files: string[]): Promise<boolean> {
  return Promise.all(files.filter(file => {
      const ext = file.match(/\.(\w+)$/)?.[1]
      if (ext !== 'txt' && ext !== 'ext' && ext !== 'doc') {
          return false
      }
      return true
  }).map(file => {
      const ext = file.match(/\.(\w+)$/)?.[1]
      if (ext === 'txt') {
          return uploadByFtp(file)
      } else if (ext === 'exe') {
          return new Promise((resolve, reject) => {
              uploadBySftp([file], ret => {
                  if (ret) {
                      resolve(true)
                  } else {
                      reject()
                  }
              })
          })
      } else if (ext === 'doc') {
          return Promise.resolve(uploadByHttp(file))
      }
  })).then(() => {
      console.log('upload success.')
      return true
  })
}

type IUploadWrap = (file: string) => Promise<boolean>;

// 新的实现如下
type IUploadStrategyMap = {
  [key: string]: IUploadWrap | IUploadWrap[]
};

enum UPLOAD_STATUS {
  PENDING,
  SUCCESSED,
  FAILED
}

type IUploadTask = {
  file: string;
  strategy: IUploadWrap;
  status: UPLOAD_STATUS;
  msg?: string;
};

type IUploadResult = {
  tasks: IUploadTask[];
  success: boolean;
};

function getExt (file: string) {
  return file.match(/\.(\w+)$/)?.[1];
}

const uploadByFtpWrap = (file: string) => uploadByFtp(file);
const uploadBySftpWrap = (file: string): Promise<boolean> => new Promise((resolve) => {
  uploadBySftp([file], (ret) => {
      resolve(ret);
  });
})
const uploadByHttpWrap = (file: string): Promise<boolean> => Promise.resolve(uploadByHttp(file));

const uploadStrategyMap: IUploadStrategyMap = {
  txt: uploadByFtpWrap,
  ext: uploadBySftpWrap,
  doc: uploadByHttpWrap
};

function uplaod (files: string[], uploadStrategyMap: IUploadStrategyMap): Promise<IUploadResult> {
  console.trace('receive files: ', files);
  console.trace('receive uploadStrategyMap:', uploadStrategyMap);
  const needUploadedFiles = files.filter(file => {
      const ext = getExt(file);
      return Boolean(uploadStrategyMap[ext]);
  });
  console.info('files that match uploadStrategyMap: ', needUploadedFiles);
  const uploadTasks: IUploadTask[] = [];
  needUploadedFiles.forEach((file) => {
      const ext = getExt(file);
      let fn = uploadStrategyMap[ext];
      if (!(fn instanceof Array)) {
          fn = [fn];
      }
      fn.forEach(f => {
          uploadTasks.push({
              file,
              strategy: f,
              status: UPLOAD_STATUS.PENDING
          });
      });
  });
  console.info('upload tasks: ', uploadTasks);
  const pros = uploadTasks.map(task => task.strategy.call(null, task.file));
  return new Promise((resolve, reject) => {
      Promise.all(pros)
          .then(rets => {
              rets.forEach((ret, idx) => {
                  uploadTasks[idx].status = Boolean(ret) ? UPLOAD_STATUS.SUCCESSED : UPLOAD_STATUS.FAILED;
                  !Boolean(ret) && (uploadTasks[idx].msg = 'upload failed');
              });
              console.warn('tasks that failed: ', uploadTasks.filter(task => task.status === UPLOAD_STATUS.FAILED));
              resolve({
                  tasks: uploadTasks,
                  success: rets.every(Boolean)
              });
          })
          .catch(err => {
              reject(err);
          })
  });
}
