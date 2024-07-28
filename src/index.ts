import { } from 'koishi'

export const name = 'bat'

export const inject ={
  required: ['database'],
  optional: [],
}
declare module 'koishi'{
  interface Tables { p_system: p_system }
  interface Tables { p_graze: p_graze }
}
export interface p_system {
  id: number
  userid: string
  usersname: string
  p: number
  time: Date
}

export interface p_graze {
  id: number
  channelid: string
  bullet: number
  p: number
  users: string
}

export async function apply(ctx) {
  ctx.model.extend('p_system', {
    id: 'unsigned',
    userid: 'string',
    time: 'timestamp',
    usersname: 'string',
    p: 'integer'
  }, { autoInc: true })

  ctx.database.extend("blockly_key_value", {
    key: "string",
    value: "string",
    targetName: "string",
  }, { primary: "key" })

  ctx.model.extend('p_graze', {
    id: 'unsigned',
    channelid: 'string',
    bullet: 'integer',
    p: 'integer',
    users: 'string'
  }, { autoInc: true })

  const plugin_id = "44814a13-7ad2-44b1-a6da-9fa9a5475ec1.";


  const tmp = await ctx.database.get('blockly_key_value', { key: '1.群列表' });
  const value = tmp[0]?.value || '';
  const groups = value.split('-');

  for (let i = 0, k = 1; i < groups.length; i++) {
    const group = groups[i];

    const tmp = await ctx.database.get('blockly_key_value', { key: group + '.用户列表' });
    const value = tmp[0]?.value || '';
    const p = (await ctx.database.get('blockly_key_value', { key: plugin_id + group }))[0]?.value;
    const users = value.split('-');
    const check = await ctx.database.get('p_graze', { channelid: group });
    if (!check.length)
      await ctx.database.create('p_graze',{channelid: group , bullet:0 , p:p , users: value})

    for (let j = 0; j < users.length; j++) {
      const userId = users[j];
      const user = (await ctx.database.get('blockly_key_value', { key: plugin_id + userId + '的签到时间' }))[0]?.targetName;
      const value = (await ctx.database.get('blockly_key_value', { key: plugin_id + userId + '的P点' }))[0]?.value;

      const tmp = await ctx.database.get('p_system', { userid: userId, });
      if (tmp.length)
        continue;
      else
        await ctx.database.create('p_system');

      await ctx.database.set('p_system', k++,
        {
          userid: userId,
          usersname: user,
          p: value,
        })
    }
  }
  ctx.database.drop('blockly_key_value');
  ctx.database.drop('blockly');
}

