import{l as e,u as t}from"./auth-CZcg7uRn.js";function n(){let e=t();if(!e.isConfigured())throw Error(`请先在设置中配置AI接口`);return{baseURL:e.aiEndpoint.replace(/\/+$/,``),apiKey:e.aiApiKey,timeoutMs:(e.requestTimeout||30)*1e3}}function r(){return t().aiModel||e.deepseek.model}function i(e){return{...e,thinking:{type:`disabled`}}}async function a(e,{body:t,timeoutMs:r,signal:i}){let{baseURL:a,apiKey:o}=n(),s=new AbortController,c=setTimeout(()=>s.abort(),r),l=()=>s.abort();i?.addEventListener(`abort`,l);try{let n=await fetch(a+e,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${o}`},body:JSON.stringify(t),signal:s.signal});if(!n.ok){let e=``;try{let t=await n.json();e=t?.error?.message||t?.message||``}catch{}throw Error(`请求失败 (${n.status}): ${e}`.trim())}return await n.json()}finally{clearTimeout(c),i?.removeEventListener(`abort`,l)}}async function o(e){let{timeoutMs:t}=n();return a(`/chat/completions`,{body:e,timeoutMs:t})}async function s(){let{baseURL:e,apiKey:t,timeoutMs:r}=n(),i=new AbortController,a=setTimeout(()=>i.abort(),r);try{let n=await fetch(e+`/models`,{method:`GET`,headers:{Authorization:`Bearer ${t}`},signal:i.signal});if(!n.ok)throw Error(`请求失败 (${n.status})`);return await n.json()}finally{clearTimeout(a)}}async function c(e,n=``){let a=await o(i({model:r(),messages:[{role:`system`,content:`你是英语词典助手。返回JSON格式，严格遵守以下规则：
1. partOfSpeech 必须使用英文缩写：n. v. adj. adv. pron. prep. conj. art. int.（多个词性用"/"连接，如"v./n."）
2. definitions 最多2个最常用的意思
3. 请结合提供的上下文语境，理解单词在文中使用的含义

返回格式：
{
  "definitions": [
    {"partOfSpeech": "英文缩写词性", "meaning": "中文释义"}
  ]
}`},{role:`user`,content:n?`请提供单词 "${e}" 的详细信息，参考以下上下文语境理解其含义：\n上下文："${n}"`:`请提供单词 "${e}" 的详细信息`}],response_format:{type:`json_object`},max_tokens:t().basicInfoMaxTokens||300}));return JSON.parse(a.choices[0].message.content)}async function l(e,n){let a=await o(i({model:r(),messages:[{role:`system`,content:`你是英语词典助手。将上下文句子翻译成中文。

翻译规则：必须用 **...** 双星号标记目标单词对应的中文翻译！

返回JSON格式：
{
  "contextTranslation": "完整翻译，目标词用**标记**"
}

示例：
- 单词 read，上下文 "I read an interesting book yesterday" → {"contextTranslation": "我昨天**读**了一本有趣的书"}`},{role:`user`,content:`上下文："${n}"\n\n请翻译句子并标记单词 "${e}" 对应的中文`}],response_format:{type:`json_object`},max_tokens:t().contextMaxTokens||200}));return JSON.parse(a.choices[0].message.content)}async function u(e,n,r){let i=t();r||=i.maxConcurrency||50;let a=[],o=0,s=e.length;for(let t=0;t<s;t+=r){let i=e.slice(t,t+r),l=await Promise.allSettled(i.map(async e=>{try{let t=typeof e==`string`?e:e.word,r=await c(t,typeof e==`string`?``:e.context);return o++,n(o,s,null),{word:t,info:r,success:!0}}catch(e){return o++,n(o,s,e.message),{word,error:e.message,success:!1}}}));a.push(...l.map(e=>e.value||e.reason))}return a}var d={general:`通用`,story:`故事`,news:`新闻`,academic:`学术`,dialogue:`对话`},f={small:`高中小作文（简洁正式的应用文）`,long:`高中大作文（读后续写风格，以叙事为主，情节完整且有推进）`},p={general:`普通作文（无特定格式，按常规作文书写）`,recommendation:`推荐信（应用文书信格式，开头称呼，正文说明推荐理由，结尾用 Yours sincerely 并署名 Li Hua）`,thankYou:`感谢信（应用文书信格式，开头称呼，正文表达感谢及原因，结尾用 Yours sincerely 并署名 Li Hua）`,invitation:`邀请信（应用文书信格式，开头称呼，正文说明活动时间地点与安排，结尾用 Yours sincerely 并署名 Li Hua）`,suggestion:`建议信（应用文书信格式，开头称呼，正文给出具体建议及理由，结尾用 Yours sincerely 并署名 Li Hua）`,application:`申请信（应用文书信格式，开头称呼，正文介绍自己并说明申请理由，结尾用 Yours sincerely 并署名 Li Hua）`,apology:`道歉信（应用文书信格式，开头称呼，正文诚恳道歉并说明补救措施，结尾用 Yours sincerely 并署名 Li Hua）`,complaint:`投诉信（应用文书信格式，开头称呼，正文客观说明问题并表达诉求，结尾用 Yours sincerely 并署名 Li Hua）`};async function m(e,t={}){let n=r(),{mode:a=`essay`,essayType:s=`small`,format:c=`general`,style:l=`general`,wordCount:u=80,customDescription:m=``,sourceArticle:h=``}=t,g=a===`essay`,_=g&&s===`long`,v=Math.min(2e3,Math.max(20,Math.round(Number(u)||80))),y=Math.max(2,Math.min(6,Math.round(v/80))),b=Math.min(8192,Math.max(500,v*3)),x,S;if(_){let t=[`请根据以下阅读材料续写文章。`,``,`【阅读材料与题目说明】`,h,``,`【续写要求】`,`- 续写长度：约 ${v} 个英文单词（允许 ±10% 浮动），分 ${y} 段`,`- 时态与叙事风格需与阅读材料保持一致`,`- 情节合理连贯，有清晰的发展和自然的结局`,`- 若材料中给出了段落开头句，续写的各段必须以此开头`];e.length&&t.push(`- 尽量自然地包含以下单词：`+e.join(`, `)),m&&t.push(`- 其他要求：`+m),t.push(``),t.push(`请只返回续写正文内容，不要标题、不要任何额外解释。`),x=`你是英语续写助手。请根据给定阅读材料进行读后续写，保持与原文一致的时态、人称和叙事风格，情节衔接自然，内容完整。`,S=t.join(`
`)}else{let t=[`1. 自然地包含以下单词：`+(e.length?e.join(`, `):`（不限）`)];g?(t.push(`2. 作文类型：`+(f[s]||f.small)),s===`small`&&t.push(`3. 写作格式：`+(p[c]||p.general))):t.push(`2. 文章风格：`+(d[l]||`通用`)),t.push(`4. 难度：高中水平，词汇与句式符合高中生英语写作要求`),t.push(`5. 长度：约 ${v} 个英文单词（允许 ±10% 浮动）`),t.push(`6. 段落数：约 ${y} 段`),m&&t.push(`7. 其他要求：`+m),t.push(`请只返回文章正文内容，不要标题、不要任何额外解释。`),x=`你是一个英语写作助手。请根据给定的单词列表生成一篇英语文章，文章要自然地包含这些单词，供英语学习者阅读。`,S=`请生成一篇英语文章，要求：
`+t.join(`
`)}return(await o(i({model:n,messages:[{role:`system`,content:x},{role:`user`,content:S}],max_tokens:b}))).choices[0].message.content}async function h(e,t={}){let n=r(),{mode:a=`essay`,essayType:s=`small`,style:c=`general`}=t,l;l=a===`essay`?s===`long`?`读后续写文章`:`高中英语作文`:d[c]||`英语文章`;let u=await o(i({model:n,messages:[{role:`system`,content:`你是英语写作助手。请根据文章内容生成英文标题与中文描述，返回JSON格式：
{
  "title": "英文标题",
  "description": "中文描述"
}
要求：
1. title：5-12个单词，切题、吸引人，不要使用引号、句号，不要包含换行
2. description：必须使用中文，一句话概括文章大致内容（30-60字），供学习者快速了解文章`},{role:`user`,content:`这是一篇${l}，请根据以下内容生成英文标题与中文描述：\n\n${e.slice(0,3e3)}`}],response_format:{type:`json_object`},max_tokens:150})),f=JSON.parse(u.choices[0].message.content);return{title:(f.title||``).trim(),description:(f.description||``).trim()}}async function g(){return(await s()).data.map(e=>e.id).sort()}async function _(){let e=r();try{return await o(i({model:e,messages:[{role:`user`,content:`Hello`}],max_tokens:5})),{success:!0,message:`连接成功`}}catch(e){return{success:!1,message:e.message}}}export{c as a,h as i,g as n,l as o,m as r,_ as s,u as t};