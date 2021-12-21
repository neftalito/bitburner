/** @param {NS} ns **/
export async function main(ns) {
	//We set a few variables
	//Target variable to change it faster and always hack this target
	var target = "alpha-ent";

	//Money tresshold variable, we get the server max money and multiply it by 0.75 so we get the 75% of the max money
	//We want this since now we can grow the money till is at its 75% of max amount, and then we hack it 
	var moneyTresh = ns.getServerMaxMoney(target) * 0.75;

	//Also we set a security tresshold, so we weaken it first since this improves our hacking possibilities of success
	var securityTresh = ns.getServerMinSecurityLevel(target) + 5;

	//While true loop so it'll loop forever
	while(true){
		//Here we compare the target server security level with the security tresshold, and if its higher, we weaken it 
		if(ns.getServerSecurityLevel(target) > securityTresh){
			await ns.weaken(target)
		}
		//Here we compare the amount of money available and check if its lowe than our money tresshold so we grow it
		else if (ns.getServerMoneyAvailable(target) < moneyTresh){
			await ns.grow(target)
		}
		//And if both security level and money available are fine, we execute hack
		else{
			await ns.hack(target)
		}
	}
}