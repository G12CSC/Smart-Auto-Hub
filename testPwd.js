import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("123456", 10);
console.log(hash);

const val=await bcrypt.compare("123456", hash);

console.log(val);