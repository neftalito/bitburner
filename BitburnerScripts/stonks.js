/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");

	//User Settings
	var investPercent = 0.85; //Percentage of overall networth invested at once (desired). Default 0.85
	var rebalanceThresh = 5000000000; //Essentially, how much more a position must be worth for you to take profits
	var addPositionThresh = 20000000; //How much less than what you want to own you must before buying
	var initialInvestmentThresh = 500000; //Minimum investment on a new stock. Default 500k
	//End User Settings



	var symbols = ["ECP", "MGCP", "BLD", "CLRK", "OMTK", "FSIG", "KGI", "FLCM", "STM", "DCOMM", "HLS", "VITA", "ICRS", "UNV", "AERO", "OMN", "SLRS", "GPH", "NVMD", "WDS", "LXO", "RHOC", "APHE", "SYSC", "CTK", "NTLK", "OMGA", "FNS", "SGC", "JGN", "CTYS", "MDYN", "TITN"];
	var investedStocks = 0;
	var shares = [];
	var prices = [];
	var maxStocks = [];
	var purchasePrice = [];
	var totalWorth = 0;
	var lastCoH = 0;
	var initialNW = 0;

	ns.print("Getting initial positions...");
	for (let i = 0; i < symbols.length; i = i + 1) {
		let position = ns.stock.getPosition(symbols[i]);
		shares.push(position[0]);
		prices.push(ns.stock.getAskPrice(symbols[i]));
		purchasePrice.push(position[1]);
		maxStocks.push(ns.stock.getMaxShares(symbols[i]));
		totalWorth += position[0] * position[1];
		if (position[0] > 0) {
			investedStocks++;
		}
	}
	var stockInvestmentRatio = 1 / (symbols.length * ((investedStocks + 2) / symbols.length));
	if (investedStocks === 0) {
		stockInvestmentRatio = 0.05;
	}
	initialNW = totalWorth + ns.getServerMoneyAvailable("home");

	while (true) {
		totalWorth -= lastCoH;
		var cashOnHand = ns.getServerMoneyAvailable("home");
		totalWorth += cashOnHand;
		lastCoH = cashOnHand;
		//Since we aren't investing in every stock, figure out about how much should go in to each
		//Could cause an over-investment (above investPercent) or running out of COH
		//if many stocks suddenly becomes attractive.

		var maxPosition = (totalWorth * investPercent) * stockInvestmentRatio;
		ns.clearLog();
		ns.print(investedStocks + " stocks currently invested in, " + ns.nFormat(stockInvestmentRatio, "(0.00%)") + " NW per-stock ratio.");
		ns.print(ns.nFormat(cashOnHand, "$0.000a") + " CoH, " + ns.nFormat(totalWorth, "$0.000a") + " NW, " + ns.nFormat(maxPosition, "$0.000a") + " is our base position");
		ns.print("Total NW increase since program launch: " + ns.nFormat((totalWorth / initialNW) - 1, "0.00%"));
		ns.print("-----");
		ns.print("Positions: ");
		symbols.forEach((item, index, array) => {
			if (shares[index] > 0) {
				ns.print(item.padEnd(6)
					+ ns.nFormat(prices[index] * shares[index], "$0.000a").padStart(10)
					+ "  (" + ns.nFormat(shares[index], "0,0").padEnd(10)
					+ " @ " + ns.nFormat(prices[index], "$0,0.00").padStart(12) + ")"
					+ "  - Bought @ "
					+ ns.nFormat(purchasePrice[index], "$0,0.00").padStart(10)
					+ (purchasePrice[index] > prices[index] ? "  ▼ (" + ns.nFormat((purchasePrice[index] - prices[index]), "$0,0.00") + ")" : "  ▲ " + ns.nFormat(prices[index] - purchasePrice[index], "$0,0.00"))
				);
			}
		});
		ns.print("-----");
		symbols.forEach(function (item, index, array) {
			var forecast = ns.stock.getForecast(item);
			var sharesNum = shares[index];
			if (forecast < 0.5) {
				if (shares[index] > 0) {
					var salePrice = ns.stock.sell(item, sharesNum);
					if (salePrice != 0) {
						ns.print("Sold " + ns.nFormat(sharesNum, "0,0") + " shares of " + item + " for " + ns.nFormat((sharesNum * salePrice), "$0.000a") + " Forecast: " + ns.nFormat(forecast, "0.000"));
						investedStocks--;
						var soldPosition = ns.stock.getPosition(item);
						totalWorth -= prices[index] * shares[index];
						shares[index] = soldPosition[0];
						prices[index] = salePrice;
						purchasePrice[index] = soldPosition[1];
						totalWorth += prices[index] * shares[index];
					} else {
						ns.print("Selling " + item + " reported unsuccessful sale?");
					}
				}
			} else if (forecast > 0.6) {
				var sharePrice = ns.stock.getAskPrice(item);
				var position = sharesNum * sharePrice;
				//Weight how much to buy based on forecast
				var adjustedMaxPosition = maxPosition * (1 + (forecast * 0.3));
				var diff = Math.floor(adjustedMaxPosition - position);
				if (diff > initialInvestmentThresh && position < adjustedMaxPosition + addPositionThresh) {
					var buyPrice = 0;
					var maxShares = maxStocks[index];
					var amountBought = 0;
					if ((diff / sharePrice) < (maxShares - shares[index])) {
						amountBought = diff / sharePrice;
					} else {
						amountBought = maxShares - shares[index];
					}
					if (amountBought > 0) {
						buyPrice = ns.stock.buy(item, amountBought);
						if (buyPrice != 0) {
							ns.print("Bought " + ns.nFormat(amountBought, "0,0") + " shares of " + item + " for " + ns.nFormat((amountBought * buyPrice), "$0.000a") + " Forecast: " + ns.nFormat(forecast, "0.000"));
							var boughtPosition = ns.stock.getPosition(item);
							if (shares[index] === 0) {
								investedStocks++;
							}
							purchasePrice[index] = boughtPosition[1];
							totalWorth -= prices[index] * shares[index];
							shares[index] = boughtPosition[0];
							prices[index] = sharePrice;
							totalWorth += prices[index] * shares[index];
						} else {
							ns.print("Could not buy " + item);
						}
					}
				} else if (diff < (-1 * rebalanceThresh)) {
					var overboughtShareAmount = Math.floor(Math.abs(diff / sharePrice));
					var overboughtSalePrice = ns.stock.sell(item, overboughtShareAmount);
					if (overboughtSalePrice != 0) {
						ns.print("Overweight (Profit Taking): Sold " + ns.nFormat(overboughtShareAmount, "0,0") + " shares of " + item + " for " + ns.nFormat((overboughtShareAmount * overboughtSalePrice), "$0.000a") + " Forecast: " + ns.nFormat(forecast, "0.000"));
						var overboughtPosition = ns.stock.getPosition(item);
						totalWorth -= prices[index] * shares[index];
						shares[index] = overboughtPosition[0];
						prices[index] = sharePrice;
						purchasePrice[index] = overboughtPosition[1];
						totalWorth += prices[index] * shares[index];
						if (shares[index] === 0) {
							investedStocks--;
						}
					} else {
						ns.print("Overbought: Selling " + item + " reported unsuccessful sale?");
					}
				} else {
					totalWorth -= prices[index] * shares[index];
					prices[index] = sharePrice;
					totalWorth += prices[index] * shares[index];
				}
			} else {
				var sharePrice = ns.stock.getAskPrice(item);
				totalWorth -= prices[index] * shares[index];
				prices[index] = sharePrice;
				totalWorth += prices[index] * shares[index];
			}
		});
		stockInvestmentRatio = 1 / (symbols.length * ((investedStocks + 2) / symbols.length));
		await ns.sleep(6000);
	}
}