'use babel';

export function reevalHs(code, examples) {
  console.log("here")
  fwrite("temp.hs.temp", code);
  let out = execSync('./g2 ' + '. ' + path + ' f').toString();
  return out;
}

// given code and examples,
// how can we fix the code to fit the examples
export function pbeRepairHs(code, examples) {
  newCode = code;
}
