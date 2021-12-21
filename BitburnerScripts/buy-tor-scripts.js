/** @param {NS} ns **/
export async function main(ns) {
    var scripts = ["BruteSSH.exe","FTPCrack.exe","relaySMTP.exe","HTTPWorm.exe","SQLInject.exe","DeepscanV2.exe","AutoLink.exe"];
    for(let i = 0; i<scripts.length;i++){
    ns.purchaseProgram(scripts[i])
}