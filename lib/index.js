var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(src_exports);
var name = "bat";
var inject = {
  required: ["database"],
  optional: []
};
async function apply(ctx) {
  ctx.model.extend("p_system", {
    id: "unsigned",
    userid: "string",
    time: "timestamp",
    usersname: "string",
    p: "integer"
  }, { autoInc: true });
  ctx.database.extend("blockly_key_value", {
    key: "string",
    value: "string",
    targetName: "string"
  }, { primary: "key" });
  ctx.model.extend("p_graze", {
    id: "unsigned",
    channelid: "string",
    bullet: "integer",
    p: "integer",
    users: "string"
  }, { autoInc: true });
  const plugin_id = "44814a13-7ad2-44b1-a6da-9fa9a5475ec1.";
  const tmp = await ctx.database.get("blockly_key_value", { key: "1.群列表" });
  const value = tmp[0]?.value || "";
  const groups = value.split("-");
  for (let i = 0, k = 1; i < groups.length; i++) {
    const group = groups[i];
    const tmp2 = await ctx.database.get("blockly_key_value", { key: group + ".用户列表" });
    const value2 = tmp2[0]?.value || "";
    const p = (await ctx.database.get("blockly_key_value", { key: plugin_id + group }))[0]?.value;
    const users = value2.split("-");
    const check = await ctx.database.get("p_graze", { channelid: group });
    if (!check.length)
      await ctx.database.create("p_graze", { channelid: group, bullet: 0, p, users: value2 });
    for (let j = 0; j < users.length; j++) {
      const userId = users[j];
      const user = (await ctx.database.get("blockly_key_value", { key: plugin_id + userId + "的签到时间" }))[0]?.targetName;
      const value3 = (await ctx.database.get("blockly_key_value", { key: plugin_id + userId + "的P点" }))[0]?.value;
      const tmp3 = await ctx.database.get("p_system", { userid: userId });
      if (tmp3.length)
        continue;
      else
        await ctx.database.create("p_system");
      await ctx.database.set(
        "p_system",
        k++,
        {
          userid: userId,
          usersname: user,
          p: value3
        }
      );
    }
  }
  ctx.database.drop("blockly_key_value");
  ctx.database.drop("blockly");
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  apply,
  inject,
  name
});
