const expressApp = require('express');
const axiosModule = require('axios');

const appInstance = expressApp();
const listeningPort = 9876;

appInstance.listen(listeningPort, () => {
    console.log(`Server running on port ${listeningPort}`);
});
const windowLimit = 10;
let currentWindow = [];
const isValidIdentifier = (identifier) => ['p', 'f', 'e', 'r'].includes(identifier);

function checkPrime(number) {
    const sqrtNumber = Math.sqrt(number);
    for (let divisor = 2; divisor <= sqrtNumber; divisor++)
        if (number % divisor === 0) return false;
    return number > 1;
}

function generatePrimesList(count) {
    let primeNumbers = [];
    for (let candidate = 2; primeNumbers.length < count; candidate++) {
        if (checkPrime(candidate)) primeNumbers.push(candidate);
    }
    return primeNumbers;
}

function generateFibonacciSequence(count) {
    let fibonacciSeries = [0, 1];
    for (let index = 2; fibonacciSeries.length < count; index++) {
        fibonacciSeries[index] = fibonacciSeries[index - 1] + fibonacciSeries[index - 2];
    }
    return fibonacciSeries;
}

function generateEvenSequence(count) {
    let evenNumbers = [];
    for (let value = 0; evenNumbers.length < count; value += 2) {
        evenNumbers.push(value);
    }
    return evenNumbers;
}

function generateRandomSequence(count, upperLimit = 100) {
    let randomValues = [];
    for (let iteration = 0; randomValues.length < count; iteration++) {
        randomValues.push(Math.floor(Math.random() * upperLimit));
    }
    return randomValues;
}

const retrieveNumbers = async (typeId) => {
    let resultNumbers = [];
    switch (typeId) {
        case 'p':
            resultNumbers = generatePrimesList(10);
            break;
        case 'f':
            resultNumbers = generateFibonacciSequence(10);
            break;
        case 'e':
            resultNumbers = generateEvenSequence(10);
            break;
        case 'r':
            resultNumbers = generateRandomSequence(10);
            break;
        default:
            console.error('Invalid Type:', typeId);
            return [];
    }
    return resultNumbers;
};

const computeAverage = (numbersArray) => {
    if (!numbersArray.length) return 0;
    const totalSum = numbersArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return (totalSum / numbersArray.length).toFixed(2);
};

appInstance.get('/numbers/:type', async (request, response) => {
    const { type } = request.params;

    if (!isValidIdentifier(type)) {
        return response.status(400).json({ error: 'Invalid number type' });
    }

    const windowBeforeUpdate = [...currentWindow];
    const fetchedNumbers = await retrieveNumbers(type);

    fetchedNumbers.forEach((number) => {
        if (!currentWindow.includes(number)) {
            currentWindow.push(number);
        }
    });

   
    if (currentWindow.length > windowLimit) {
        currentWindow = currentWindow.slice(-windowLimit);
    }

    const averageValue = computeAverage(currentWindow);

    response.json({
        windowBeforeUpdate,
        windowAfterUpdate: currentWindow,
        fetchedNumbers,
        averageValue,
    });
});
