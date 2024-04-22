import axios from "axios";
import inquirer from "inquirer";
import chalk from "chalk";
(async () => {
    const answers = await inquirer.prompt([
        { type: "number", name: "amount", message: "Enter the amount you want to convert" },
        {
            type: "list",
            name: "fromCurrency",
            message: "Select the currency you want to convert from",
            choices: ["USD", "EUR", "BTC", "INR", "IRR", "PKR", "EXIT"],
        },
        {
            type: "list",
            name: "toCurrency",
            message: "Select the currency you want to convert to",
            choices: ["USD", "EUR", "BTC", "INR", "IRR", "PKR", "EXIT"],
        },
    ]);
    const { amount, fromCurrency, toCurrency } = answers;
    if ([fromCurrency === "EXIT" || toCurrency === "EXIT"]) {
        console.log(chalk.red("Exiting..."));
        process.exit();
    }
    try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const exchangeRate = response.data.rates[toCurrency];
        if (exchangeRate === undefined) {
            console.log(`Sorry, we don't support conversion from ${fromCurrency} to ${toCurrency}.`);
            return;
        }
        const convertedAmount = amount * exchangeRate;
        console.log(chalk.yellow(`${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(2)} ${toCurrency}.`));
    }
    catch (error) {
        console.error("Error fetching exchange rates:", error);
    }
})();
