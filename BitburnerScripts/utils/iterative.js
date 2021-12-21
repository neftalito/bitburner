/** @param {NS} ns **/
export async function main(ns) {
    await ns.sleep(2000);
    for(var s=["."],i=0;i<s.length;i++)s.push(...ns.scan(s[i]).filter(n=>!s.includes(n)));
}