/** @param {NS} ns **/
export async function main(ns) {
    var ramCost = ns.getUpgradeHomeRamCost();
	while(true){
		if(ramCost < ns.getServerMoneyAvailable()){
			ns.upgradeHomeRam();
		}
	}
}