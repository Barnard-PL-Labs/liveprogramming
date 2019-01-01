'use babel';

export function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

const sygusJsMap = {
  "str.++": "+"
};

exports.sygusJsMap = sygusJsMap;
