const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("用法: node scripts/hash-admin-password.cjs <你的管理员密码>");
  process.exit(1);
}

console.log(bcrypt.hashSync(password, 10));
